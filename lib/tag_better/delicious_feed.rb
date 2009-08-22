
class TagBetter::DeliciousFeed
  
  attr_accessor :username
  
  def self.for_user(username)
    new(username).bookmarks
  end
  
  def initialize(username)
    @username = username
  end
  
  def bookmarks
    feed = RestClient.get("http://feeds.delicious.com/v2/json/#{username}")
    doc = JSON.load(feed)
    doc.map { |obj| TagBetter::Bookmark.from_feed(obj) }
  end
  
end
