class TagBetter::Bundle < CouchRest::ExtendedDocument
  
  property :username
  property :name
  property :tags
  
  view_by :username
  
  def self.for(username, password)
    bundles = by_username(:key => username)
    if bundles.empty?
      returning TagBetter::Delicious.bundles_for(username, password) do |bundles|
        database.bulk_save(bundles)
      end
    else
      bundles
    end
  end
  
end
