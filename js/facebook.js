			// Facebook

			FB.Event.subscribe('auth.login', function(response) {
//				alert('auth.login event ' + response );
			});
			FB.Event.subscribe('auth.logout', function(response) {
//				alert('auth.logout event ' + response );
			});

			FB.Event.subscribe('auth.sessionChange', function(response) {
//				alert('auth.sessionChange event ' + response );
			});

			FB.Event.subscribe('auth.statusChange', function(response) {
//				alert('auth.statusChange event ' + response );
			});

			function getLoginStatus() {
				FB.getLoginStatus(function(response) {
					if (response.status == 'connected') {
						alert('logged in: ' + response.status);
					} else {
						alert('not logged in: ' + response.status );
					}
				});
			}

			var friendIDs = [];
			var fdata;

			function me()
			{

				FB.api(
					'/me/friends',
					{ fields: 'id, name, picture' },
					function( response )
					{
						if (response.error)
						{
							alert(JSON.stringify(response.error));
						}
						else
						{
							var data = document.getElementById('data');
							fdata=response.data;
							console.log("fdata: "+fdata);
							response.data.forEach(
								function(item)
								{
									var d = document.createElement('div');
									d.innerHTML = "<img src="+item.picture+"/>"+item.name;
									data.appendChild(d);
								}
							);
						}

						var friends = response.data;
						console.log(friends.length);
						for (var k = 0; k < friends.length && k < 200; k++)
						{

							var friend = friends[k];
							var index = 1;

							friendIDs[k] = friend.id;
							//friendsInfo[k] = friend;
						}
						console.log("friendId's: "+friendIDs);
					}
				);

			}

			function logout()
			{

				FB.logout(
					function(response)
					{
//						alert('logged out');
					}
				);

			}

			function login()
			{
				FB.login(
					function(response)
					{

						if (response.session)
						{
//							alert('logged in');
						}
						else
						{

//							alert('not logged in');

						}
					},
					{ scope: "email" }
				);
			}

			function facebookWallPost( message )
			{

				if ( mode == 'debug' ) alert( message );

				console.log('Debug 1');
				var params = {
					method: 'feed',
					name: 'NattPasset',
					link: 'http://www.nattpasset.se/',
					picture: webServiceUrl + 'img/npfb.png',
					caption: 'Dela på Facebook',
					description: message
					};
				console.log( params );

				FB.ui(
					params,
					function( obj )
					{
						console.log( obj );
					}
				);

			}

			function publishStoryFriend()
			{

				randNum = Math.floor ( Math.random() * friendIDs.length );

				var friendID = friendIDs[randNum];

				if (friendID == undefined)
				{

					alert('please click the me button to get a list of friends first');

				}
				else
				{

					console.log( "friend id: " + friendID );
					console.log( 'Opening a dialog for friendID: ', friendID );

					var params = {
						method: 'feed',
						to: friendID.toString(),
						name: 'Facebook Dialogs',
						link: 'https://developers.facebook.com/docs/reference/dialogs/',
						picture: 'http://fbrell.com/f8.jpg',
						caption: 'Reference Documentation',
						description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
					};

					FB.ui(
						params,
						function( obj )
						{
							console.log( obj );
						}
					);

				}

			}

//			if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
//			if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
//			if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

/*
			$(document).ready(
				function()
				{

				alert("session: " + JSON.stringify(FB.getSession()));

					try
					{
alert( 'FB.init' );
						if (typeof FB != 'undefined')
						{

							FB.init( { appId: facebookAppId, nativeInterface: CDV.FB, useCachedDialogs: false } );
						}
						else
						{

							$(".np-ui-facebook-button").addClass('ui-disabled');

						}

					} catch (e) {
						console.log(e);
						alert(e);
					}

				}
			);
*/
		// Facebook ends


// ----------------------------------------------------------------------------- facebookAttach
function facebookInit()
{

/*
	if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
	if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
	if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
*/

	FB.init( { appId: facebookAppId, nativeInterface: CDV.FB, useCachedDialogs: false } );

}

// ----------------------------------------------------------------------------- facebookLogin
function facebookLogin()
{

	if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
	if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
	if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

	setTimeout(
		function()
		{

			facebookInit();

			FB.getLoginStatus(
				function( response )
				{

					if (response.status != 'connected')
					{

						FB.login(
							function( response )
							{
								if ( response.session )
								{
//									alert('logged in');
									$("#facebookLoginButton").hide();
									$("#facebookLogoutButton").show();
								}
								else
								{
//									alert('not logged in');
									$("#facebookLoginButton").show();
									$("#facebookLogoutButton").hide();
								}

								$.mobile.changePage( '#homePage' );

							},
							{
								scope: "email"
							}
						);
					}

				}
			);
		}
	);

}

// ----------------------------------------------------------------------------- facebookLogout
function facebookLogout()
{

	if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
	if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
	if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

	setTimeout(
		function()
		{

			FB.logout(
				function(response)
				{

					$("#facebookLoginButton").show();
					$("#facebookLogoutButton").hide();

					$.mobile.changePage( '#homePage' );

				}
			);

		},
		50
	);

}

// ----------------------------------------------------------------------------- facebookAttach
function facebookPostOnWall( message )
{

	if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
	if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
	if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

//	FB.init( { appId: facebookAppId, nativeInterface: CDV.FB, useCachedDialogs: false } );
//	facebookInit();

	setTimeout(
		function()
		{

			FB.getLoginStatus(function(response) {
				if (response.status == 'connected') {
					facebookWallPost( message );
				}
			});

		},
		50
	);

}
