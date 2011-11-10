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
      
      # better to not assume that messages arrive in sequence ???
      # probably better so check if entry for _id exists if not store away if one exists merge and store
      observationFromDb = @mongo.collection('observations').find_one({"_id" => observation['_id']})
      if observationFromDb == nil
        log "Observation with _id #{observation['_id']} not in DB (expected) so store it from XMPP stanza"
        store_observation_in_mongo(observation)
      else
        log "Observation with _id #{observation['_id']} found in DB (unexpected), so merge data with XMPP stanza and store"
        observation.each_pair do |k,v|
          observationFromDb[k] = v
        end
        store_observation_in_mongo(observationFromDb)
      end
    end
    
    event :changed_observation? do |stanza, data|
      # this will create the observation obj from the data received in the XMPP stanza
      observation = data['payload']
      ['origin', 'run', 'timestamp'].each{|meta| observation[meta] = data[meta]}
      
      # check if there is an object with the _id, which was received in the stanza, is stored in the db
      log "observation id in stanza #{observation['_id']}"
      # (OrderedHash, Nil) find_one(spec_or_object_id = nil, opts = {})
      observationFromDb = @mongo.collection('observations').find_one({"_id" => observation['_id']})
      
      if observationFromDb != nil
        log "Observation hash for id #{observation['_id']} from mongo db: #{observationFromDb}"
        # TODO iterate over observation and copy all fields to observationFromDb then store observationFromDb
        observation.each_pair do |k,v|
          observationFromDb[k] = v
        end
      else
        log "No observation found for id: #{observation['_id']}"
        # no observation returned from db so copy observation into observationDB
        observationFromDb = observation
      end
      
      log "observation hash: #{observation}"
      log "observationFromDb hash after copying in observation hash: #{observationFromDb}"
      
      store_observation_in_mongo(observationFromDb)
    end
    
    event :remove_observation? do |stanza, data|
      # this will create the observation obj from the data received in the XMPP stanza
      observation = data['payload']
      ['origin', 'run', 'timestamp'].each{|meta| observation[meta] = data[meta]}
      
      # log _id of observation to be deleted
      log "observation to be deleted _id: #{observation['_id']}"
      if @mongo.collection('observations').remove({"_id" => observation['_id']})
        log "deleting observation with _id: #{observation['_id']} was successfull"
      else
        log "deleting observation with _id: #{observation['_id']} FAILED !!"
      end
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
