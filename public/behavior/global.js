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
	CLASSNAME_FOR_TAG_ADDING:      'adding',
	CLASSNAME_FOR_TAG_REMOVING:    'removing',
	
	ID_FOR_TAGS_LIST:              'tags',
	
	ID_FOR_LOGOUT:                 'logout',
	ID_FOR_FORGET:                 'forget',
	
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
			
			* Tag Bundle [DONE]
				-- makes it selected
				
			* Tag [DONE] 
				-- toggles it between in-bundle and not-in-bundle, 
					as long as a Tag Bundle is selected
					
			* "Create Bundle" button 
				-- creates a stub bundle JS object into which one
					can add/remove tags
					
			* "Forgot password" link
				-- Do confirm() before sending along
		*/
		
		// Check for a click in the bundles list
		if ( $(event.target).parents('#' + this.ID_FOR_BUNDLES_LIST).length )
		{
			// Grab the list item of the selected bundle
			
			$(event.target).parents('li')
				.addClass(this.CLASSNAME_FOR_SELECTED_BUNDLE)
				.siblings().removeClass(this.CLASSNAME_FOR_SELECTED_BUNDLE);
				
			var bundleName = $(event.target).parents('li')
				.find('span').text();
								
			this.setSelectedBundle(bundleName);
			
			event.preventDefault();
			return;
		}
		
		// Check for click in the tags list 
		if ( $(event.target).parents('#' + this.ID_FOR_TAGS_LIST).length )
		{
			this.toggleTag( $(event.target).parents('li')[0] );
			event.preventDefault();
			return;
		}
		
		if ( event.target.id == this.ID_FOR_LOGOUT )
		{
		  this.logout();
		  event.preventDefault();
		  return;
		}
		
		if ( event.target.id == this.ID_FOR_FORGET )
		{
		  this.forget();
		  event.preventDefault();
		  return;
		}
	},
	
	processKeyEvents: function(event)
	{
		/* 
			List of elements on which clicks do stuff:
			
			* Search query box
				-- when a key is typed, does a lookup 
					on the query that's in the search box
		*/
		
		TagBetter.Network.getTags($.trim(event.target.value));
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
			for (var i=0, len = this.currentlySelectedBundle.tags.length; i < len; i++)
			{
				if (this.currentlySelectedBundle.tags[i] == tag)
				{
					return true;
				}
			}
			
			/* If it got this far, then it must not have found the tag within the bundle */
			return false;
		}
	},
	
	setSelectedBundle: function(bundleName)
	{	
		for (var i=0, len = this.bundles.length; i < len; i++)
		{
			if (this.bundles[i].name == bundleName)
			{
				this.currentlySelectedBundle = this.bundles[i];
				this.buildTagList();
				return;
			}
		}
	},
	
	updateTagCountOnSelectedBundle: function()
	{		
		$('#' + this.ID_FOR_BUNDLES_LIST + ' li.' + this.CLASSNAME_FOR_SELECTED_BUNDLE)
			.find('em').text(this.currentlySelectedBundle.tags.length);
	},
	
	/* This adds a given tag to the currently selected bundle:
	
		tag: [string]
		listItemElement: [DOM Element]
	*/
	addTagToSelectedBundle: function(tag, listItemElement)
	{
		// Check if it already has the "adding" classname, just to be sure
		if ( $(listItemElement).hasClass(this.CLASSNAME_FOR_TAG_ADDING))
		{
			// Note to self: If you want to be fancy about it, 
			// you could try removing the tag once again at this point.
			return;
		}
		
		$(listItemElement).addClass(this.CLASSNAME_FOR_TAG_ADDING);
		
		this.currentlySelectedBundle.tags.push(tag);
		
		// Make sure it's still sorted
		this.currentlySelectedBundle.tags.sort();
		
		var self = this;
		TagBetter.Network.applyChanges(this.currentlySelectedBundle, function()
		{
			// This is the function that runs upon success of the Ajax call -- it
			// removes the temporary "adding" class and adds on the "in-bundle" class
			$(listItemElement)
				.removeClass(self.CLASSNAME_FOR_TAG_ADDING)
				.addClass(self.CLASSNAME_FOR_TAG_IN_BUNDLE);
				
			self.updateTagCountOnSelectedBundle();
		});
	},
	
	/* This removes a given tag from the currently selected bundle:
	
		tag: [string]
		listItemElement: [DOM Element]
	*/
	removeTagFromSelectedBundle: function(tag, listItemElement)
	{
		// Check if it already has the "removing" classname, just to be sure
		if ( $(listItemElement).hasClass(this.CLASSNAME_FOR_TAG_REMOVING))
		{
			// Note to self: If you want to be fancy about it, 
			// you could try adding the tag back in at this point.
			return;
		}
		
		$(listItemElement).addClass(this.CLASSNAME_FOR_TAG_REMOVING);
		
		var newTagList = []; // initialize
		
		// Go through the currently selected bundle's tag list, and as you go,
		// add those tags to the new tag list -- except if it's the tag we're removing
		
		for (var i=0, len = this.currentlySelectedBundle.tags.length; i < len; i++)
		{
			if (this.currentlySelectedBundle.tags[i] != tag)
			{
				newTagList.push( this.currentlySelectedBundle.tags[i] );
			}
		}
		
		this.currentlySelectedBundle.tags = newTagList;
		
		var self = this;
		TagBetter.Network.applyChanges(this.currentlySelectedBundle, function()
		{
			// This is the function that runs upon success of the Ajax call -- it
			// removes the temporary "adding" class and adds on the "in-bundle" class
			$(listItemElement)
				.removeClass(self.CLASSNAME_FOR_TAG_ADDING)
				.removeClass(self.CLASSNAME_FOR_TAG_IN_BUNDLE);
				
			self.updateTagCountOnSelectedBundle();
		});
	},
	
	/* Tag bits
	   ---------------------------------------------------------------- */
	
	/* 
		This is fired after someone clicks on a tag:
	
	 	* If that tag is currently in the given bundle, it removes it
		* If that tag isn't yet in the current bundle, it adds it
	*/
	toggleTag: function(listItemElement)
	{
		if (!this.currentlySelectedBundle)
		{
			return null;
		}
		
		var tag = $(listItemElement).text();
		
		switch ( $(listItemElement).hasClass(this.CLASSNAME_FOR_TAG_IN_BUNDLE) )
		{
			// It's currently in the bundle, so let's remove it
			case true:
				this.removeTagFromSelectedBundle(tag, listItemElement);
				break;
		
			// It's not yet in the bundle, so let's add it
			case false:
				this.addTagToSelectedBundle(tag, listItemElement);
				break;
		}
	},
	
	/* Markup-building bits
	   ---------------------------------------------------------------- */
	
	/* This creates the markup for the tag list (based
		off the this.viewableTags array of tags) */
	buildTagList: function()
	{
		var tagListMarkup = []; // initialize
		var className;
		
		for (var i=0, len = this.viewableTags.length; i < len; i++)
		{
			var currentTag = this.viewableTags[i]; // cache this lookup
			
			/* Example markup that we're creating:
				<li><a href="#" title="1 Bookmark">lorem</a></li>
			*/
			
			switch ( this.isTagInSelectedBundle(currentTag.name) )
			{
				case true:
					className = this.CLASSNAME_FOR_TAG_IN_BUNDLE;
					break;
				
				case false:
					className = "";
					break;
			}
			
			tagListMarkup.push('<li><a class="' + className + '" href="#" title="' + currentTag.count + (currentTag.count==1 ? ' Bookmark">' : ' Bookmarks">') + currentTag.name + '</a></li>\n');
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
			var className;
			
			/* Example markup that we're creating:
				<li><a href="#" class="selected">People <em>500</em></a></li>
			*/
			
			var tagCount = currentBundle.tags.length;
			
			switch ( tagCount )
			{
				case 0:
					className = this.CLASSNAME_FOR_EMPTY_BUNDLE;
					break;
				
				default:
					className = "";
					break;
			}
			
			bundleListMarkup.push('<li><a class="' + className + '" href="#"><span>' + currentBundle.name + '</span> <em>' + tagCount + '</em></a></li>\n');
		}
		
		$('#' + this.ID_FOR_BUNDLES_LIST).html( bundleListMarkup.join('') );
	},
	
	logout: function() 
	{
    $('body').append("<form id='forget' method='POST' action='/forget'></form>");
    $('#forget')[0].submit();
    return;
	},
	
	forget: function() {
	  $('body').append("<form id='purge' method='POST' action='/purge'></form>");
    $('#purge')[0].submit();
    return;
	}
};

TagBetter.Network = 
{
	mostRecentQuery: null, // initialize
	
	getBundles: function()
	{
		$.ajax(
		{
			type:     'GET',
			cache:    'false',
			dataType: 'json',
			url:       TagBetter_Config.bundlesURI,
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
		
		if (typeof query == "undefined")
		{
			query = "";
		}
		
		if (query === this.mostRecentQuery)
		{
			return;
		}
		
		this.mostRecentQuery = query;
		
		if (query.length)
		{
			data =
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
			url:       (query.length) ? TagBetter_Config.searchTagsURI : TagBetter_Config.tagsURI,
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
	
	applyChanges: function(bundle, callback)
	{
		var data = '';
		
		data += '{';
		data += '"name": "' + bundle.name.replace('"', '\"') + '"';
		
		if (bundle.tags.length) {
			data += ', "tags": [';
			tags = [];
			
			for (var i = bundle.tags.length - 1; i >= 0; i--){
				tags.push('\"' + bundle.tags[i].replace('"', '\"') + '\"');
			};
			
			data += tags.join(', ');
			data += ']';
		}
		
		data += '}';
		
		$.ajax(
		{
			type:    'POST',
			data:    data,
			url:     TagBetter_Config.bundlesURI,
			success: callback
		});
	}
	
};


$(document).ready(function()
{
	TagBetter.App.initialize();
});