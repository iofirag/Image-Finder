var app = angular.module('app.services', []);
app.factory('userService', [()=> {


    var service = {
        
        saveToSearchList: (searchTerm,type,date,resLength) =>{
            let searchList = JSON.parse( localStorage.getItem('searchList') ) || [];
            searchList.push({searchTerm:searchTerm, type:type, date:date, resLength:resLength})
            localStorage.setItem('searchList', JSON.stringify(searchList));
        },
        getSearchList: ()=> {
            return JSON.parse( localStorage.getItem('searchList') );
        },
        clearSearchList: ()=>{
            localStorage.removeItem('searchList');
        },
        saveLastSearchTerm: (searchTerm) =>{
            sessionStorage.setItem('lastSearchTerm',searchTerm)
        },
        restoreLastSearchTerm: () =>{
            return sessionStorage.getItem('lastSearchTerm')
        },

        saveLastSearchResults: (searchTerm) =>{
            sessionStorage.setItem('lastSearchResults',JSON.stringify(searchTerm))
        },
        restoreLastSearchResults: () =>{
            return JSON.parse( sessionStorage.getItem('lastSearchResults') )
        }
    }
    return service;
}]);