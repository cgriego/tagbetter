class TagBetter::Bundle < CouchRest::ExtendedDocument
  
  property :userhash
  property :name
  property :tags
  
  view_by :userhash
  
  def self.for(username, password)
    bundles = by_userhash(:key => TagBetter.userhash(username, password))
    if bundles.empty?
      TagBetter.logger.info "Cache miss: #{username}/bundles"
      returning TagBetter::Delicious.bundles_for(username, password) do |bundles|
        database.bulk_save(bundles)
      end
    else
      TagBetter.logger.info "Cache hit: #{username}/bundles"
      
      bundles
    end
  end
  
end
