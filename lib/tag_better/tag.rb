class TagBetter::Tag < CouchRest::ExtendedDocument
  
  property :userhash
  property :name
  property :count
  
  view_by :userhash
  
  def self.for(username, password)
    tags = by_userhash(:key => TagBetter.userhash(username, password))
    if tags.empty?
      TagBetter.logger.info "Cache miss: #{username}/tags"
      returning TagBetter::Delicious.tags_for(username, password) do |tags|
        database.bulk_save(tags)
      end
    else
      TagBetter.logger.info "Cache hit: #{username}/tags"
    end
  end
  
  def self.search(userhash, query)
    by_userhash(:key => userhash).select { |t| t.name.include?(query) }
  end
  
end
