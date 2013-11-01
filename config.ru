# This file is used by Rack-based servers to start the application.

require 'sinatra'

get '*' do
  File.read(File.join('public', 'index.html'))
end

run Sinatra::Application
