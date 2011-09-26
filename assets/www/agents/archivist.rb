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
      
      log "Joining #{agent_jid_in_room.inspect}..."
      
      client.write(pres)
    end
    
    event :new_observation? do |stanza, data|
      store_payload_in_mongo('wallcology', data['payload'], data['origin'], data['timestamp'])
    end
    
    message :error? do |err|
      puts "\n\n\n"
      puts "!" * 80
      puts "GOT ERROR MESSAGE: #{err.inspect}"
      puts "!" * 80
      log err, :ERROR
    end
    
    disconnected do
      # automatically reconnect
      puts "DISCONNECTED!"
      log "disconnected", :WARN
      puts "attempting to reconnect..."
      client.connect
    end
  end
  
  
  protected
  
  def store_payload_in_mongo(collection, payload, origin, timestamp)
    payload['origin'] = origin
    payload['timestamp'] = timestamp
    log "Storing payload in collection #{collection.inspect}: #{payload.inspect}"
    @mongo.collection('observations').save(payload)
  end
end
