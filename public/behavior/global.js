TagBetter.App = 
{
	ID_FOR_BUNDLES_FORM:       'new-bundle-form',
	ID_FOR_TAG_FILTER_TEXTBOX: 'filter-tags-q',
	
	// Bundle-related constants
	CLASSNAME_FOR_SELECTED_BUNDLE: 'selected',
	
	// Tag-related constants
	CLASSNAME_FOR_TAG_IN_BUNDLE:   'in-bundle',
	CLASSNAME_FOR_TAG_ADDED:       'added',
	CLASSNAME_FOR_TAG_REMOVED:     'removed',
	
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
	allTags:      [],
	viewableTags: [],
	
	initialize: function()
	{
		this.allTags = this.viewableTags = TagBetter.Network.getTags(""); // blank query
		this.buildTagList();
		
		this.bundles = TagBetter.Network.getBundles();
		this.buildBundlesList();
		
		$(document.documentElement).bind('click', this.processClicks, this);
		
		$('#' + this.ID_FOR_TAG_FILTER_TEXTBOX).bind('keyup', this.processKeyEvents, this);
	},
	
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
	
	/* This creates the markup for the tag list (based
		off the this.viewableTags array of tags) */
	buildTagList: function()
	{
		
	},
	
	/* This creates the markup for the bundles list (based
		off the this.bundles array of bundles) */
	buildBundlesList: function()
	{
		
	}
	
};

TagBetter.Network = 
{
	getBundles: function()
	{
		
	},
	
	getTags: function(query)
	{
		
	},
	
	applyChanges: function()
	{
		
	}
	
};


$(document).ready(function()
{
	TagBetter.App.initialize();
});