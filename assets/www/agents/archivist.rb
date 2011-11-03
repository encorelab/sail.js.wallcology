require 'rubygems'
require 'blather/client/dsl'
require 'json'
require 'mongo'

$: << 'sail.rb/lib'
require 'sail/agent'

class Archivist < Sail::Agent
  def behaviour
    when_ready do
      @mongo = Mongo::Connection.new.db(config[:database])
      
      pres = Blather::Stanza::Presence::Status.new
      pres.to = agent_jid_in_room
      pres.state = :chat
      
      log "Joining #{agent_jid_in_room.inspect}..."
      
      client.write(pres)
    end
    
    event :new_observation? do |stanza, data|
      observation = data['payload']
      ['origin', 'run', 'timestamp'].each{|meta| observation[meta] = data[meta]}
      store_observation_in_mongo(observation)
    end
    
    event :changed_observation? do |stanza, data|
      observation = data['payload']
      ['origin', 'run', 'timestamp'].each{|meta| observation[meta] = data[meta]}
      store_observation_in_mongo(observation)
    end
    
    message :error? do |err|
      log err, :ERROR
    end
    
    disconnected do
      # automatically reconnect
      log "disconnected... will attempt to reconnect", :WARN
      client.connect
    end
  end
  
  
  protected
  
  def store_observation_in_mongo(observation)
    log "Storing observation: #{observation.inspect}"
    @mongo.collection('observations').save(observation)
  end
end
