class TagBetter::Delicious
  
  def self.bundles_for(username, password)
    doc = fetch('/tags/bundles/all', username, password)
    doc.xpath('/bundles/bundle').map do |n|
      returning TagBetter::Bundle.new do |bundle|
        bundle.userhash = TagBetter.userhash(username, password)
        bundle.name = n['name']
        bundle.tags = n['tags'].split(' ')
      end
    end
  end
  
  def self.tags_for(username, password)
    doc = fetch('/tags/get', username, password)
    doc.xpath('/tags/tag').map do |n|
      returning TagBetter::Tag.new do |tag|
        tag.userhash = TagBetter.userhash(username, password)
        tag.name = n['tag']
        tag.count = Integer(n['count'])
      end
    end
  end
  
  def self.update_bundle(bundle, username, password)
    post('/tags/bundles/set', 
      {:bundle => bundle['name'], :tags => bundle['tags'].join(' ')},
      username, password)
  end
  
  protected
  
  def self.fetch(path, username, password)
    TagBetter.logger.info("Fetch: #{path} for #{username}")
    
    url = "https://#{username}:#{password}@api.del.icio.us/v1#{path}"
    xml = RestClient.get(url)
    Nokogiri.XML(xml)
  end
  
  def self.post(path, args, username, password)
    TagBetter.logger.info("Post: #{path} with #{args.inspect} for #{username}")
    
    url = "https://#{username}:#{password}@api.del.icio.us/v1#{path}"
    resp = Nokogiri.XML(RestClient.post(url, args))
    resp.root.content == 'ok'
  end
  
end
