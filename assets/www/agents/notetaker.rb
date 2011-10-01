require 'rubygems'
require 'blather/client/dsl'
require 'json'
require 'mongo'

$: << 'sail.rb/lib'
require 'sail/agent'

class Notetaker < Sail::Agent  
  def behaviour
    when_ready do
      @mongo = Mongo::Connection.new.db(config[:database])
      
      pres = Blather::Stanza::Presence::Status.new
      pres.to = agent_jid_in_room
      pres.state = :chat
      
      log "Joining #{agent_jid_in_room.inspect}..."
      
      client.write(pres)
    end
    
    event :ck_new_note? do |stanza, sev|
      note = {
        :content => sev['payload'],
        :author  => sev['origin'],
        :timestamp => sev['timestamp'],
        :run => sev['run'],
        # use the note's id as the mongo id 
        # (in theory this could eventually fail -- id's are pseudo-randomly generated and there is a 1 in 1e50 chance of a clash)
        :_id => sev['payload']['id']
      }
      
      store_note_in_mongo(note)
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
  
  def store_note_in_mongo(note)
    log "Storing note: #{note.inspect}"
    @mongo.collection('notes').save(note)
  end
end
