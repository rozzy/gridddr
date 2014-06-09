require 'uglifier'

class Numeric
  def to_human
    units = %w{B KB MB GB TB}
    e = (Math.log(self)/Math.log(1024)).floor
    s = "%.3f" % (to_f / 1024**e)
    s.sub(/\.?0*$/, units[e])
  end

  def percent_of(n)
    (100 - self.to_f / n.to_f * 100.0).ceil
  end
end


Dir.glob('./*[^min].js') do |e|
  new_name = File.basename(e, ".*").concat(".min.js")
  File.write(new_name, Uglifier.compile(File.read(e)))
  puts "#{e}\e[0;33m(#{File.size(e).to_human})\e[0;m → #{new_name}\e[0;33m(#{File.size(new_name).to_human})\e[0;m \e[0;31m(#{File.size(new_name).percent_of File.size(e)}% compressed)\e[0;m\n"
end
