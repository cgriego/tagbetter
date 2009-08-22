class TagBetter::Bookmark < CouchRest::ExtendedDocument
  
  property :username
  property :description
  property :title
  property :timestamp
  property :tags
  property :url
  
  view_by :username
  
  def self.from_feed(obj)
    returning new do |bookmark|
      bookmark.username = obj['a']
      bookmark.description = obj['n']
      bookmark.title = obj['d']
      bookmark.timestamp = obj['dt']
      bookmark.tags = obj['t']
    end
  end
  
end
