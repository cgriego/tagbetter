class TagBetter::Delicious
  
  def self.bundles_for(username, password)
    doc = fetch('/tags/bundles/all', username, password)
    doc.xpath('/bundles/bundle').map do |n|
      returning TagBetter::Bundle.new do |bundle|
        bundle.username = username
        bundle.name = n['name']
        bundle.tags = n['tags']
      end
    end
  end
  
  def self.tags_for(username, password)
    doc = fetch('/tags/get', username, password)
    doc.xpath('/tags/tag').map do |n|
      returning TagBetter::Tag.new do |tag|
        tag.username = username
        tag.name = n['tag']
        tag.count = Integer(n['count'])
      end
    end
  end
  
  protected
  
  def self.fetch(path, username, password)
    xml = RestClient.get("https://#{username}:#{password}@api.del.icio.us/v1/#{path}")
    Nokogiri.XML(xml)
  end
  
end
