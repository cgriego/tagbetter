class TagBetter::Tag < CouchRest::ExtendedDocument
  
  property :username
  property :name
  property :count
  
  view_by :username
  
  def self.for(username, password)
    tags = by_username(:key => username)
    if tags.empty?
      returning TagBetter::Delicious.tags_for(username, password) do |tag|
        database.bulk_save(tags)
      end
    else
      tags
    end
  end
  
end
