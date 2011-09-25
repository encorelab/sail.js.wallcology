$: << "sail.rb/lib"
require 'sail/daemon'

require 'archivist'

AGENT_PASSWORD = "329eb6a50e0b7ff71fed77dd876f4847e7cd2020"
XMPP_DOMAIN = `hostname`.strip # assuming that the current hostname is also the xmpp domain

@daemon = Sail::Daemon.spawn(
  :name => "wallcology",
  :path => '.',
  :verbose => true
)

# Julia's run
@daemon << Archivist.new(:room => "wallcology-julia-fall2011", :host => XMPP_DOMAIN, :password => AGENT_PASSWORD)

# Ben's run
@daemon << Archivist.new(:room => "wallcology-ben-fall2011", :host => XMPP_DOMAIN, :password => AGENT_PASSWORD)

@daemon.start
