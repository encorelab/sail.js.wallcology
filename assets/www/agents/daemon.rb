$: << "sail.rb/lib"
require 'sail/daemon'

require 'archivist'
require 'notetaker'

AGENT_PASSWORD = "1d6f760bc95729166e551d7bee1d75c69b133015"
XMPP_DOMAIN = 'aardvark.encorelab.org'.strip # assuming that the current hostname is also the xmpp domain

@daemon = Sail::Daemon.spawn(
  :name => "wallcology",
  :path => '.',
  :verbose => true
)

# Julia's run
@daemon << Archivist.new(:room => "wallcology-julia-fall2011", :host => XMPP_DOMAIN, :password => AGENT_PASSWORD, :database => 'wallcology')
@daemon << Notetaker.new(:room => "wallcology-julia-fall2011", :host => XMPP_DOMAIN, :password => AGENT_PASSWORD, :database => 'common-knowledge')

# Ben's run
@daemon << Archivist.new(:room => "wallcology-ben-fall2011", :host => XMPP_DOMAIN, :password => AGENT_PASSWORD, :database => 'wallcology')
@daemon << Notetaker.new(:room => "wallcology-ben-fall2011", :host => XMPP_DOMAIN, :password => AGENT_PASSWORD, :database => 'common-knowledge')

@daemon.start
