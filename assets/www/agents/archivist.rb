require 'rubygems'
require 'blather/client/dsl'
require 'json'
require 'mongo'

$: << 'sail.rb/lib'
require 'sail/agent'

class Archivist < Sail::Agent
  def behaviour
    when_ready do
      @mongo = Mongo::Connection.new.db('wallcology')
      
      pres = Blather::Stanza::Presence::Status.new
      pres.to = agent_jid_in_room
      pres.state = :chat
      
      puts "Joining #{agent_jid_in_room.inspect}..."
      
      client.write(pres)
    end
    
    event :new_observation? do |stanza, data|
      store_payload_in_mongo('wallcology', data['payload'], data['origin'])
    end
    
    message :error? do |err|
      puts "\n\n\n"
      puts "!" * 80
      puts "GOT ERROR MESSAGE: #{err.inspect}"
      puts "!" * 80
    end
    
    disconnected do
      # automatically reconnect
      puts "DISCONNECTED!"
      puts "attempting to reconnect..."
      client.connect
    end
  end
  
  
  protected
  
  def store_payload_in_mongo(collection, payload, origin)
    log "Storing payload in collection #{collection.inspect}: #{payload.inspect}"
    payload['origin'] = origin
    @mongo.collection('observations').save(payload)
  end
end
