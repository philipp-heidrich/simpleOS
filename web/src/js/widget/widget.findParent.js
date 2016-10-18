/**
 *	Check has this element this parent
 */
function hasParent(parent, child, returnParent)
{
	// Loop all Parents
	function loopAllParents(node, parentArray)
	{
		for(var i = 0; i < parentArray.length; i++)
		{
			if(parentArray[i] == node)
			{
				return node;
			}
		}

		return false;
	}

	var node = child.parentNode,
		parents = (typeof parent == 'string') ? document.querySelectorAll(parent) : parent;

	while(node != null)
	{
		var parentFound = loopAllParents(node, parents);

		if(parentFound)
		{
			if(returnParent)
			{
				return parentFound;
			}
			else {
				return true;
			}
		}

		node = node.parentNode;
	}

	return false;
}
