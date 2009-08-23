if (typeof TagBetter == "undefined")
{
	TagBetter = {};
}

TagBetter.App = 
{
	ID_FOR_BUNDLES_FORM:       'new-bundle-form',
	ID_FOR_TAG_FILTER_TEXTBOX: 'filter-tags-q',
	
	// Bundle-related constants
	CLASSNAME_FOR_SELECTED_BUNDLE: 'selected',
	CLASSNAME_FOR_EMPTY_BUNDLE:    'empty',
	
	ID_FOR_BUNDLES_LIST:           'tag-bundles',
	
	// Tag-related constants
	CLASSNAME_FOR_TAG_IN_BUNDLE:   'in-bundle',
	CLASSNAME_FOR_TAG_ADDED:       'added',
	CLASSNAME_FOR_TAG_REMOVED:     'removed',
	
	ID_FOR_TAGS_LIST:              'tags',
	
	/*
		Example object within this array:
		{name: "name here", tags: ['tag1', 'tag2'] }
	*/
	bundles: [],
	currentlySelectedBundle: null, // initialize
	
	/* 
		One might normally be able to simply use viewableTags all the time,
		but I figure that this may save us a network hit if/when the 
		query field is cleared out. 
	*/
	allTags:      [], // example object:  { "count": 1,   "tag": "$$" },
	viewableTags: [], // example object:  [same]
	
	initialize: function()
	{
		TagBetter.Network.getTags(""); // blank query
		
		TagBetter.Network.getBundles();
		
		$(document.documentElement).bind('click', this.processClicks, this);
		
		$('#' + this.ID_FOR_TAG_FILTER_TEXTBOX).bind('keyup', this.processKeyEvents, this);
	},
	
	/* Event Handlers
	   ---------------------------------------------------------------- */
	
	processClicks: function(event)
	{
		/* 
			List of elements on which clicks do stuff:
			
			* Tag Bundle 
				-- makes it selected
				
			* Tag 
				-- toggles it between in-bundle and not-in-bundle, 
					as long as a Tag Bundle is selected
					
			* "Create Bundle" button
				-- creates a stub bundle JS object into which one
					can add/remove tags
		*/
		
	},
	
	processKeyEvents: function(event)
	{
		/* 
			List of elements on which clicks do stuff:
			
			* Search query box
				-- when a key is typed, does a lookup 
					on the query that's in the search box
		*/
	},

	/* Bundle bits
	   ---------------------------------------------------------------- */
	
	isTagInSelectedBundle: function(tag)
	{
		if (!this.currentlySelectedBundle)
		{
			return false;
		}
		else
		{
			/* TO DO */
		}
	},
	
	/* Tag bits
	   ---------------------------------------------------------------- */
	
	
	/* Markup-building bits
	   ---------------------------------------------------------------- */
	
	/* This creates the markup for the tag list (based
		off the this.viewableTags array of tags) */
	buildTagList: function()
	{
		var tagListMarkup = []; // initialize
		
		for (var i=0, len = this.viewableTags.length; i < len; i++)
		{
			var currentTag = this.viewableTags[i]; // cache this lookup
			
			/* Example markup that we're creating:
				<li><a href="#" title="1 Bookmark">lorem</a></li>
			*/
			
			switch ( this.isTagInSelectedBundle(currentTag.tag) )
			{
				case true:
					var className = this.CLASSNAME_FOR_TAG_IN_BUNDLE;
					break;
				
				case false:
					var className = "";
					break;
			}
			
			tagListMarkup.push('<li><a class="' + className + '" href="#" title="' + currentTag.count + ' Bookmark">' + currentTag.tag + '</a></li>\n');
		}
		
		$('#' + this.ID_FOR_TAGS_LIST).html( tagListMarkup.join('') );
	},
	
	/* This creates the markup for the bundles list (based
		off the this.bundles array of bundles) */
	buildBundleList: function()
	{
		var bundleListMarkup = []; // initialize
		
		for (var i=0, len = this.bundles.length; i < len; i++)
		{
			var currentBundle = this.bundles[i]; // cache this lookup
			
			/* Example markup that we're creating:
				<li><a href="#" class="selected">People <em>500</em></a></li>
			*/
			
			var tagCount = currentBundle.tags.length;
			
			switch ( tagCount )
			{
				case 0:
					var className = this.CLASSNAME_FOR_EMPTY_BUNDLE;
					break;
				
				default:
					var className = "";
					break;
			}
			
			bundleListMarkup.push('<li><a class="' + className + '" href="#">' + currentBundle.name + ' <em>' + tagCount + '</em></a></li>\n');
		}
		
		$('#' + this.ID_FOR_BUNDLES_LIST).html( bundleListMarkup.join('') );
	}
	
};

TagBetter.Network = 
{
	mostRecentQuery: "", // initialize
	
	getBundles: function()
	{
		$.ajax(
		{
			type:     'GET',
			cache:    'false',
			dataType: 'json',
			url:       TagBetter_Config.getBundlesURI,
			success:   function(jsonResult)
			{
				if (jsonResult.bundles)
				{	
					TagBetter.App.bundles = jsonResult.bundles;
					
					TagBetter.App.buildBundleList();
				}
			}
		});
	},
	
	getTags: function(query)
	{
		var data = {}; // initialize
		
		if (typeof query != "undefined" && query.length)
		{
			if (query === this.mostRecentQuery)
			{
				return;
			}
			
			this.mostRecentQuery = query;
			
			var data =
			{
				q: query
			};
		}
		
		$.ajax(
		{
			type:     'GET',
			cache:    'false',
			dataType: 'json',
			data:      data,
			url:       TagBetter_Config.getTagsURI,
			success:   function(jsonResult)
			{
				if (jsonResult.tags)
				{	
					TagBetter.App.viewableTags = jsonResult.tags;
					
					// If the query was for getting all tags, update
					// the allTags variable too
					if (typeof query == "undefined" | !query.length)
					{
						TagBetter.App.allTags = jsonResult.tags;
					}
					
					TagBetter.App.buildTagList();
				}
			}
		});
		
	},
	
	applyChanges: function()
	{
		
	}
	
};


$(document).ready(function()
{
	TagBetter.App.initialize();
});