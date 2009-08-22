class Bookmark
  
  attr_accessor :username, :description, :title, :timestamp, :tags, :url
  
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
