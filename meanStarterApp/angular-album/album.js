var app = angular.module('albumApp', []);

app.controller('AlbumCtrl', function($scope) {
  $scope.images = [ 
		{image : "img/image_01.jpg",	thumbnail : "img/image_01_th.jpg", description: "Image01"},
		{image : "img/image_02.jpg",	thumbnail : "img/image_02_th.jpg", description: "Image02"},
		{image : "img/image_03.jpg",	thumbnail : "img/image_03_th.jpg", description: "Image03"},
		{image : "img/image_04.jpg",	thumbnail : "img/image_04_th.jpg", description: "Image04"},
		{image : "img/image_05.jpg",	thumbnail : "img/image_05_th.jpg", description: "Image05"}
		],
	$scope.currentImage = _.first($scope.images);
	

	$scope.setCurrentImage = function(image){
		$scope.currentImage = image;
		console.log(image);
	}
});