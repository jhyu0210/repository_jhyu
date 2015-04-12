'use strict';

// Configuring the Articles module
angular.module('custmers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Custmers', 'custmers', 'dropdown', '/custmers(/create)?');
		Menus.addSubMenuItem('topbar', 'custmers', 'List Custmers', 'custmers');
		Menus.addSubMenuItem('topbar', 'custmers', 'New Custmer', 'custmers/create');
	}
]);