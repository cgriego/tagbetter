module ObjectExtensions
  def returning(obj, &block)
    block.call(obj)
    obj
  end
end

Object.send(:include, ObjectExtensions)
