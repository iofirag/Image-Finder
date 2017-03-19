var app = angular.module('app.controllers', ['jtt_flickr','app.services']);
app.controller('imageFinderCtrl', function($scope, $http, flickrFactory, userService, $rootScope) {
    
	$scope.FLICKR = 'flickr';
	$scope.PIXABAY = 'pixabay';
    
    $scope.init = () => {
    	$scope.restoreState()
    }
    $rootScope.$on("$stateChangeStart", function (event, next, current) {
    	$scope.saveState()
	});
	window.onbeforeunload = function (event) {
		$scope.saveState()
	};

	$scope.saveState = ()=>{
		userService.saveLastSearchTerm($scope.searchTerm)
    	userService.saveLastSearchResults($scope.pictures)
	}
	$scope.restoreState = ()=>{
		$scope.searchTerm = userService.restoreLastSearchTerm() || ''
    	$scope.pictures = userService.restoreLastSearchResults() || []
	}
    $scope.keyPressed = function(keyEvent) {
	  	if (keyEvent.which === 13){
	    	$scope.fetchImages()
		}	
	}
    $scope.fetchImages = ()=>{
    	
    	$scope.pictures = [];	// Clear results
    	$scope.showLoadSpinner = 2	// Start loading spinner
    	// Flickr
		$scope.getFromFlickr().then((res)=>{
    		$scope.formatResults($scope.FLICKR,res);
    	},err=>{
    		console.log(err)
    	})
		// Pixabay
		$scope.getFromPixabay().then((res)=>{
			$scope.formatResults($scope.PIXABAY,res);
    	},err=>{
    		console.log(err)
    	})
    }
    $scope.getFromPixabay = () =>{
    	// pixabay
    	return new Promise( (resolve,reject)=>{
	    	$http({
			  method: 'GET',
			  url: 'https://pixabay.com/api/?key=4847968-c71a33bcdf72c85e6153b6afc&image_type=photo&q='+$scope.searchTerm
			}).then(function successCallback(res) {
				if (res.status==200 && !!res.data && !!res.data && res.data.hits){
					resolve(res.data.hits)
				}
			  }, function errorCallback(errRes) {
			  	reject(errRes)
			  });
		},err=>{
			reject('Pixabay errors')
		});
    }
    $scope.getFromFlickr = () =>{
    	// Flickr
    	return new Promise( (resolve,reject)=>{
	    	flickrFactory.getImagesByTags({
			    tags: $scope.searchTerm
			}).then(function(res){
			    if (res.status==200 && res.data && res.data.items){
			    	resolve(res.data.items)
			    }
			}).catch(function (res) {
			    reject(res)
			});
		},err=>{
			reject('Flickr errors')
		});
    }
    $scope.formatResults = (type,dataList)=>{
    	var picData = []
    	let showUrl = ''
		let source = ''
		let title = ''
    	switch(type){
    		case $scope.PIXABAY:
    			dataList.forEach((item)=>{
    				showUrl = item.pageURL;
    				source = item.webformatURL;
    				title = item.tags;
    				picData.push( new Image(showUrl, source, title) )
    			})
    			break;
    		case $scope.FLICKR:
    			dataList.forEach((item)=>{
    				showUrl = item.link;
    				source = item.media.m
    				title = item.title;
    				picData.push( new Image(showUrl,source,title) )
    			})
    			break;
    	}
    	$scope.showLoadSpinner -= 1
    	userService.saveToSearchList($scope.searchTerm, type, Date.now(), picData.length)
    	$scope.pictures = $scope.pictures.concat(picData)
    	$scope.$apply()
    }
    function Image(showUrl, source, title) {    	
    	this._showUrl = showUrl || ''
    	this._source = source || '';
		this._title = title || '';
    }
});

app.controller('historyCtrl', function($scope, $http, userService) {
    
    $scope.init = () => {
    	$scope.historySearches = [];  //(searchTerm, type, date, resLength)
    	console.log('init executed')
    	$scope.fetchHistorySearches()
    }
    $scope.fetchHistorySearches = ()=>{
 		$scope.historySearches = userService.getSearchList()
    }
    $scope.clearHistory = ()=>{
    	$scope.historySearches = [];
    	userService.clearSearchList()
    }
});