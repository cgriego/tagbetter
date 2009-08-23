TagBetter = 
{
	inintialize: function()
	{
		$(document.documentElement).click(this.processClicks)
	}
};

$(document).ready(function()
{
	TagBetter.initialize();
});