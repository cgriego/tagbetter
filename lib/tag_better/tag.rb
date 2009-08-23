class TagBetter::Tag < CouchRest::ExtendedDocument
  
  property :userhash
  property :name
  property :count
  
  view_by :userhash
  
  def self.for(username, password)
    tags = by_userhash(:key => TagBetter.userhash(username, password))
    if tags.empty?
      returning TagBetter::Delicious.tags_for(username, password) do |tag|
        database.bulk_save(tags)
      end
    else
      tags
    end
  end
  
end
