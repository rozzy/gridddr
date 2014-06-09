require 'uglifier'

Dir.glob('./*[^min].js') do |e|
  File.write(File.basename(e, ".*").concat(".min.js"), Uglifier.compile(File.read(e)))
end
