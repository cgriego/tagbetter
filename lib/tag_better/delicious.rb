class TagBetter::Delicious
  
  def self.bundles_for(username, password)
    xml = RestClient.get("https://#{username}:#{password}@api.del.icio.us/v1/tags/bundles/all")
    doc = Nokogiri.XML(xml)
    doc.xpath('/bundles/bundle').map do |n|
      returning TagBetter::Bundle.new do |bundle|
        bundle.username = username
        bundle.name = n['name']
        bundle.tags = n['tags']
      end
    end
  end
  
end
