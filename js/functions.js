/*

NP-512 Ric 2014-07-11

$("#regPersonalId").bind("keyup", function(event)
	{

		var cPersonal = $(this).val().replace('\t', '').replace('-', '');

		if (cPersonal.length == 8 && event.which > 10)
			$("#regPersonalId").val($("#regPersonalId").val() + '-');

	}
);

$("#regPersonalId").bind("keydown", function(event)
	{

		var cPersonal = $(this).val().replace('\t', '').replace('-', '');

		if (cPersonal.length >= 12 && event.which >=32)
			event.preventDefault();

		if (event.which == 8 || (event.which >= 48 && event.which <= 57))
		{
		}
		else
			event.preventDefault();

	}
);

$("#personalId").bind("keyup", function()
	{

		var cPersonal = $(this).val().replace('\t', '').replace('-', '');

		if (cPersonal.length == 8 && event.which > 10)
			$("#personalId").val($("#personalId").val() + '-');

		if (cPersonal.length == 10) {

			$("#gender_male").attr("checked", false).checkboxradio("refresh");
			$("#gender_female").attr("checked", false).checkboxradio("refresh");

			if ('13579'.indexOf(cPersonal.charAt(8)) > 0)
			{

				$("#gender_male").attr("checked", true).checkboxradio("refresh");

			}
			else
			{

				$("#gender_female").attr("checked", true).checkboxradio("refresh");

			}

		}

	}
);

*/

$("#zipcode").bind("keyup", function()
	{
		if ($(this).val().replace('\t', '').length == 5) {

			$.ajax(
				{
				type: "GET",
				url: getZipcodesUri,
				data: $(this).serialize(),
				success: function(xml) {

						$("#city").val($(xml).find("item>city").text());


					},
				error: function(XMLHttpRequest, textStatus, errorThrown) {

						$("#city").val("");

					}
				}
			);

		}
	}
);


function log(logMessage) {

	if (mode == 'debug') console.log(logMessage);

}

function setSizes()
{

	$width = $(document).width() - 2;
	$buttonWidth = $width - 60;
	$('#citySelectorButton').css(
		{
		'min-width': 130
		}
	);
	$('#cityButton').css(
		{
		'min-width': $width - 194
		}
	);
	$('.guidePageBannerClass').css(
		{
		'width': $width
		}
	);
	$('.front-button').css(
		{
		'width': $buttonWidth + 1
		}
	);

	$('#front-button-login').css(
		{
		'width': $buttonWidth * 0.25
		}
	);
	$('#front-button-register').css(
		{
		'width': $buttonWidth * 0.75
		}
	);

	leftButtonWidth = Math.round($buttonWidth * 0.42);
	var the_map = document.getElementById('loginButtonMap');
	the_map.innerHTML += '<area shape="rect" coords="0,0,' + leftButtonWidth + ',87" href="#loginPage" />';
	the_map.innerHTML += '<area shape="rect" coords="' + leftButtonWidth + ',0,604,87" href="javascript:account()"/>';

}

function refreshPage()
{

	$.mobile.changePage(window.location.href,
		{
		transition: "fade",
		reverse: false,
		changeHash: false,
		allowSamePageTransition: true,
		reloadPage: true,
		}
	);

}

function refreshControls()
{

	if ( isLoggedIn() ) {
		$("#loginButton").hide();
		$("#cartButton").show();
		$(".messagesMenuButton").show();
		$(".showWhenLoggedin").show();
		$(".hideWhenLoggedin").hide();
	}
	else {
		$("#loginButton").show();
		$("#cartButton").hide();
		$(".messagesMenuButton").hide();
		$(".showWhenLoggedin").hide();
		$(".hideWhenLoggedin").show();
		$.mobile.changePage( '#loginPage' );
	}

}

function infoPage(title, message, page, button)
{

	var buttonURL = iif((page == ""), '#homePage', page);
	var buttonText = iif((button == ""), 'Ok', button);

	$("#infoTitle").html(title);
	$("#infoMessage").html(message);
	$("#infoURL").text(buttonText);
	$("#infoURL").attr("href", buttonURL);
	$.mobile.changePage('#infoPage');

}

function errorPage(description, message, button, returnPage)
{

	var buttonText = iif((button == ""), 'Ok', button);

	$("#errorDescription").html(description);
	$("#errorMessage").html(message);
	$("#errorURL").text(buttonText);
	$("#errorURL").attr("href", iif((returnPage == ""), '#homePage', returnPage));

	$.mobile.changePage('#errorPage');

}

function openExternal(url)
{

	// navigator.app.loadUrl( url, { openExternal:true } );
	return window.open(encodeURI(url), '_system');

}

function showOptout()
{

	showOptOut = true;
	$("#optOut").show();
	$(".menuPanel").panel("close");

}

// ----------------------------------------------------------------------------- isLoggedIn
function isLoggedIn()
{

	if (userId == null || userId == '')
		return false;
	else
		return true;

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- isManager
function isManager()
{

	if (userId == null || userId == '')
		return false;
	else
		return (role == 'MANAGER' || role == 'ADMIN');

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- account
function account()
{

	if ( isLoggedIn() )
		$.mobile.changePage('#accountPage');
	else
		$.mobile.changePage('#registerAccountPage');

	return false;

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- passwordRecovery
function passwordRecovery(email)
{

	var ok = false;

	if (email == "")
	{

		errorPage("Du måste ange din epost i fältet ovan", "Eposten ej ifylld", "Tillbaks");
		return false;

	}

	$.ajax(
		{
		type: "GET",
		url: resetPasswordUri,
		cache: false,
		async: false,
		data: "email=" + email,
		crossDomain: true,
		dataType: "xml",
		success: function(xml)
			{

				if ($(xml).find("result>code").text() == resSuccess)
				{

					ok = true;
					infoPage("Glömt lösenord", "Ett nytt lösenord har skickats till din epost", "#homePage", "Ok");

				}
				else
				{

					errorPage('Misslyckades nollställa ditt lösenord. Har du fyllt i din epost ovan?', $(xml).find("result>description").text(), "Tillbaks");

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

	return ok;

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- iif
function iif(condition, iftrue, iffalse)
{

	if (condition) return iftrue;
	else return iffalse;

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- setCity
function setCity(cityId, cityName, cityImage)
{

	window.localStorage.setItem("city", cityId);
	window.localStorage.setItem("cityName", cityName);
	window.localStorage.setItem("cityImageName", cityImage);

	$(".cityName").html(cityName);
	$("#valjstad").panel("close");

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- authorizationHeader
function authorizationHeader()
{

	if (isLoggedIn())
		return Base64.encode(userId + ":" + password);
	else
		return '';

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- setHeaders
function setHeaders(xhr)
{

	xhr.setRequestHeader("Authorization", "Basic " + authorizationHeader());
	xhr.setRequestHeader("appVersion", appVersion);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- refreshState
function refreshState()
{

	$.ajax(
		{
		type: "GET",
		url: getInitUri,
		cache: false,
		async: false,
		data: "",
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				account_id = $(xml).find("result>account_id").text();
				cellphone = $(xml).find("result>cellphone").text();
				first_name = $(xml).find("result>first_name").text();
				last_name = $(xml).find("result>last_name").text();
				email = $(xml).find("result>email").text();
				min_app_version = $(xml).find("result>min_app_version").text();

				if ($(xml).find("result>cellphone_confirmed").text() == "true")
					cellphoneConfirmed = true;
				else
					cellphoneConfirmed = false;

				if (cellphoneConfirmed)
					$(".confirmCellPhone").hide();
				else if (isLoggedIn())
					$(".confirmCellPhone").show();

				$("#confirmCellPhoneNo").val(cellphone);
				//    $("#citySelector").val( window.localStorage.getItem( "city" ) );

				online = true;

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );
				online = false;

			}

		}
	);

	//    $("#facebookLoginButton").hide();
	// $("#facebookLogoutButton").hide();

}


// ----------------------------------------------------------------------------- confirmCellPhone
function confirmCellPhone(confirmCellphone)
{

	$.ajax(
		{
		type: "POST",
		url: confirmCellPhoneURL,
		cache: false,
		async: false,
		data: "cellphone=" + confirmCellphone,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				$.mobile.changePage('#confirmCellPhoneSuccessPage');


			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}

		}

	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- confirmCellPhone
function resendConfirmationSMS()
{

	$.ajax(
		{
		type: "POST",
		url: resendConfirmationSMSURL,
		cache: false,
		async: false,
		data: "",
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				$.mobile.changePage('#confirmCellPhoneSuccessPage');


			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}

		}

	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadTicketsPage
function loadTicketsPage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);

	loadTicketsList();

	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------

// ----------------------------------------------------------------------------- loadGuidePage
function loadGuidePage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);

	$(".guidePageBannerClass").attr("src", window.localStorage.getItem("cityImageName"));
	loadGuideList(-1); //new Date().getDay() );

	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------

// ----------------------------------------------------------------------------- loadAccountPage
function loadAccountPage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);

	loadAccount();

	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadUserAgreementPage
function loadUserAgreementPage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);

	loadUserAgreement();

	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadUserAgreementPage
function loadSupportPage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);

	loadSupportPageTop();

	if (isLoggedIn())
	{
		$("#contactEmail").val(userId);
	}
	$("#appVersion").html(appVersion);
	$("#buildDate").html(buildDate);

	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadUserAgreementPage
function loadAdminPage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);


	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadUserAgreementPage
function loadScanPage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);

	loadClubsList('ScanClubList');

	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadUserAgreementPage
function loadStatisticsPage()
{

	$.mobile.loading('show',
		{
		text: 'Loading...',
		textVisible: true,
		theme: 'z',
		html: ""
		}
	);

	loadClubsList('StatisticsClubList');

	$.mobile.loading('hide');

}
// -----------------------------------------------------------------------------


function loadCities()
{

	$("#citiesList").empty();

	$.ajax(
		{
		type: "GET",
		url: wsGetCitiesURL,
		cache: false,
		async: true,
		data: "",
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(data)
			{

				var firstLetter = '';
				xml = $(data);

				$(xml).find('item').each(
					function()
					{

						var $this = $(this);
						var name = $this.children('name').text();

						if (firstLetter != name.substring(0, 1))
						{

							firstLetter = name.substring(0, 1);

							var l = $('<li data-role="list-divider">' + firstLetter + '</li>');
							$("#citiesList").append(l);

						}

						var a = $('<a/>',
							{
							html: $this.children('name').text(),
							href: 'javascript:setCity( "' + $this.find('object_id').text() + '", "' + $this.children('name').text() + '", "'+ $this.children('image').text() +'" );'
							}
						);

						var li = $('<li/>');
						li.append(a);
						$("#citiesList").append(li);

					}
				);

				$("#citiesList").listview("refresh");

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{
				$("#homePageQuote").html("<h2>Ett fel uppstod</h2><p>Misslyckades h&auml;mta produkter fr&aring;n databasen. Det kan bero p&aring; att webbtj&auml;nsten &auml;r o&aring;tkomlig. F&ouml;rs&ouml;k igen senare.</p> " + errorThrown);
			}

		}
	);

}


// ----------------------------------------------------------------------------- verifyScan
function verifyScan(club, code)
{

	var ok = false;

	$.ajax(
		{
		type: "GET",
		url: swipeCodeUrl,
		cache: false,
		async: false,
		data: "club=" + club + "&code=" + code,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				$xml = $(xml);

				if ($(xml).find('result>code').text() == resSuccess)
				{

					ok = true;
					$('.np-tickets-left').html($(xml).find('result>tickets_left').text() + ' biljetter kvar av ' + $(xml).find('result>tickets').text());

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

	return ok;

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadClubsList
function loadClubsList(listName)
{

	$.ajax
	(
		{
		type: "GET",
		url: getAdmClubsListUrl,
		cache: false,
		async: false,
		crossDomain: true,
		data: "weekday=-1",
		dataType: "xml",
		beforeSend: function(xhr) {

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var xml = $(xml);
				var odd = false;
				var cLocation = "";
				var cStatistics = "";

				$("#" + listName).empty();
				$(xml).find('item').each(
					function()
					{

						var $this = $(this);

						cLocation = $this.children('location').text();
						cStatistics = 'Sålda: ' + $this.children('sold').text() + ' Scannade: ' + $this.children('scanned').text();

						var li = $('<li ' + iif(odd, 'data-theme="a"', 'data-theme="a"') + ' />');
						var a = $('<a/>',
							{
							html: '<h3>' + $this.children('name').text() + '<br><p style="margin-top:0px; margin-bottom:0px; font-size:12px;"><b>' + cLocation + '</b><br>' + cStatistics + '</p></h3>',
								//         href: 'javascript:scanCode( "' + $this.attr('id') + '" );'
							href: 'javascript:setTimeout( function(){scanCode( "' + $this.attr('id') + '" );}, 50 )'
							}
						);

						li.append(a);
						$("#" + listName).append(li);

						odd = !odd;

					}
				);

				$("#" + listName).listview("refresh");

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$("#" + listName).empty();
				$("#" + listName).append('<li><h2>Ett fel uppstod</h2><p>Misslyckades h&auml;mta produkter fr&aring;n databasen. Det kan bero p&aring; att webbtj&auml;nsten &auml;r o&aring;tkomlig. F&ouml;rs&ouml;k igen senare.</p><p>' + errorThrown + '</p></li>');
				$("#" + listName).listview("refresh");

			}
		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadMessagesList
function loadMessagesPage()
{

	$.ajax
	(
		{
		type: "GET",
		url: getMessagesUri,
		cache: false,
		async: true,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr) {

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var xml = $(xml);
				var odd = false;

				$("#messagesList").empty();
				$(xml).find('items>item').each(
					function()
					{

						var $this = $(this);
						var object_id = $this.children('object_id').text();
						var title = $this.children('title').text();
            var message = $this.children('message').text();
            var sent = $this.children('sent').text().substr( 0, 16 );
						if ( title > '' )
							var html = '<h3>' + title + '<p>' + message + '</p><span style="margin-right:5px; margin-top:-18px;font-size:10px;">' + sent + '</span></h3>';
						else
							var html = '<h3><p>' + message + '</p><span class="roundcorner-date" style="font-size:10px;">' + sent + '</span></h3>';

						var li = $('<li ' + iif(odd, 'data-theme="a"', 'data-theme="a"') + ' />');

						var a = $('<a/>',
							{
							html: html,
							href: '#',
							onclick: 'javascript:setTimeout( function(){showMessagePage( "' + object_id + '" );}, 50 )'
							}
						);

						li.append(a);
						$("#messagesList").append(li);

						odd = !odd;

					}
				);

				$("#messagesList").listview("refresh");

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$("#messagesList").empty();
				$("#messagesList").append('<li><h2>Ett fel uppstod</h2><p>Misslyckades h&auml;mta meddelanden fr&aring;n databasen. Det kan bero p&aring; att webbtj&auml;nsten &auml;r o&aring;tkomlig. F&ouml;rs&ouml;k igen senare.</p><p>' + errorThrown + '</p></li>');
				$("#messagesList").listview("refresh");

			}
		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- showMessage
function showMessagePage( object_id )
{

	$.ajax(
		{
			type: "GET",
			url: getMessagesUri,
			data: 'message_id=' + object_id,
			cache: false,
			async: true,
			crossDomain: true,
			dataType: "xml",
			beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
			success: function(xml)
			{

				var $item = $(xml).find('items>item');

				$("#messageTitle").html( $item.children('title').text() );
				$("#messageMessage").html( $item.children('message').text() );
				$("#messageSent").html( $item.children('sent').text().substr( 0, 16 ) );

				$.mobile.changePage( "#messagePage" );

			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( "#servicePage" );

			}
		}

	);

}


// ----------------------------------------------------------------------------- tearTicket
function tearTicket(id)
{

	var result = 0;

	if (confirm('Om du fortsätter kommer biljetten att rivas och kommer inte kunna användas igen.'))
	{

		$.ajax(
			{
			type: "POST",
			url: tearTicketUri,
			cache: false,
			async: false,
			data: "code=" + id,
			crossDomain: true,
			dataType: "xml",
			beforeSend: function(xhr)
				{

					setHeaders(xhr);

				},
			success: function(xml)
				{

					if ($(xml).find('result>code').text() == resSuccess)
						//      result = 1;
//						$('#popupOk_' + id).popup('open');
						$('#popupOk').popup('open');
					else
						$('#popupFault').popup('open');
//						$('#popupFault_' + id).popup('open');
					//      result = 2;

					$('.np-tickets-left').html($(xml).find('result>tickets_left').text() + ' biljetter kvar av ' + $(xml).find('result>tickets').text());

				},
			error: function(XMLHttpRequest, textStatus, errorThrown)
				{

					$.mobile.changePage( '#servicePage' );

				}

			}
		);

	}

	return result;

}
// ----------------------------------------------------------------------------- tearTicket end


// ----------------------------------------------------------------------------- registerAppForPush
function registerAppForPush( aid, aos )
{

//		id = window.localStorage.getItem("device_id");
//		os_type = window.localStorage.getItem("os_type");

//	if ( isLoggedIn() && ( aid > "" ) && ( id != aid ) )
	if ( ! pushIsRegistered )
	{

		$.ajax(
			{
			type: "POST",
			url: wsRegisterAppForPushURL,
			cache: false,
			async: true,
			data: 'push_id=' + aid + '&os_type=' + aos,
			crossDomain: true,
			dataType: "xml",
			beforeSend: function(xhr)
				{

					setHeaders(xhr);

				},
			success: function(xml)
				{

					if ($(xml).find('result>code').text() == resSuccess)
					{

						window.localStorage.setItem( "device_id", aid );
						window.localStorage.setItem( "os_type", aos );
						pushIsRegistered = true;

					}

				},
			error: function(XMLHttpRequest, textStatus, errorThrown)
				{

					$.mobile.changePage( '#servicePage' );

				}

			}
		);

	}

}
// ----------------------------------------------------------------------------- registerAppForPush end


function fnuffed(value)
{

	return fnuff + value + fnuff;

}

function QuotedStr(value)
{

	return fnuff + value + fnuff;

}

// ----------------------------------------------------------------------------- loadTicketsList
function loadTicketsList()
{

	$("#ticketsPageList").empty();
	$("#ticketsPageText").html('');
	$(".np-qrcode-container").text('');

	var jqxhr = $.ajax(
		{
		type: 'GET',
		url: getTicketsUri,
		dataType: 'xml',
		beforeSend: function(xhr) {
				$("#ticketsPageText").html('Laddar dina biljetter...');
				setHeaders(xhr);
			}
		}
	);

	jqxhr.done(
		function(data)
		{

			var $this = $(this);
			var id = $this.attr('id');
			var xml = $(data);

			$(xml).find('item').each(
				function()
				{

					var $this = $(this);
					var id = $this.attr('id');

					var ticketsLeft = parseInt($this.children('items').text()) - parseInt($this.children('swipes').text());
					if (ticketsLeft == 0)
						ticketsText = '<font color="red">Inga biljetter kvar</font>';
					else if (ticketsLeft == 1)
						ticketsText = ticketsLeft + ' biljett kvar av ' + $this.children('items').text();
					else
						ticketsText = ticketsLeft + ' biljetter kvar av ' + $this.children('items').text();

					var li = $('<li/>');
					var a = $('<a/>',
						{
						html: '<h3>' + $this.children('name').text() + '<span class="ui-li-count ui-btn-corner-all" style="margin-right:5px; margin-top:-18px;">' + ticketsLeft + '</span></h3>' + '<p>' + $this.children('display_date').text() + ' - ' + $this.children('venue_name').text() + '</p>',
						href: 'javascript:showTicketPage( "' + id + '" );'
						}
					);
					li.append(a);
					$("#ticketsPageList").append(li);

				}
			);

			$("#ticketsPageList").listview("refresh");

		}
	);

	jqxhr.always(
		function()
		{

			if ($('#ticketsPageList').size() == 0)
				$("#ticketsPageText").html('Det finns inga biljetter registrerade på ditt konto. Köp några vet ja...');
			else
				$("#ticketsPageText").html('');

		}
	);

}

function showTicketPage(id)
{

	var jqxhr = $.ajax(
		{
		type: 'GET',
		data: 'ticket_id=' + id,
		url: getTicketsUri,
		dataType: 'xml',
		beforeSend: function(xhr) {
				setHeaders(xhr);
			}
		}
	);

	jqxhr.done(
		function(data)
		{

			var $this = $(this);
			var xml = $(data);

			var price = '';;
			if ($(xml).find('item>price').text() == "") price = 'Gratis';
			else price = $(xml).find('item>price').text() + 'kr / biljett';

			$("#ticketInfoClubName").html($(xml).find('item>name').text());
			$("#ticketInfoStartTime").html($(xml).find('item>start_time').text().substr(0, 16));
			$("#ticketInfoEndTime").html($(xml).find('item>end_time').text().substr(0, 16));
			$("#ticketInfoVenueName").html($(xml).find('item>venue_name').text());
			$("#ticketInfoDescription").html($(xml).find('item>description').text());
			$("#ticketInfoTerms").html($(xml).find('info').text());
			$("#ticketInfoTicketsLeft").html(parseInt($(xml).find('item>items').text()) - parseInt($(xml).find('item>swipes').text()) + ' av ' + $(xml).find('item>items').text());
			$("#ticketInfoPrice").html(price);
			$("#ticketInfoTearTicket")
			.unbind()
			.click(
				function()
				{
					tearTicket(id)
				}
			);
			jQuery("#ticketInfoQR").empty();
			jQuery("#ticketInfoQR").qrcode({text: id, width: 100, height: 100});

		}
	);

	jqxhr.always(
		function()
		{

			$.mobile.changePage('#ticketPage');

		}
	);

}


// ----------------------------------------------------------------------------- showClub
function showClub(club_id)
{

	window.localStorage.setItem("club_details_id", club_id);
	$.mobile.changePage('#clubDetailsPage');

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadClubDetails
function loadClubDetails()
{

	if ( isLoggedIn() )
		$('#clubLoginButton').hide();
	else
		$('#clubLoginButton').show();

	$.ajax(
		{
		url: getClubsUri,
		cache: false,
		async: true,
		crossDomain: true,
		data: 'club_id=' + window.localStorage.getItem("club_details_id"),
		dataType: "xml",
		beforeSend: function(xhr) {

				setHeaders(xhr);

			},
		success: function(xml) {

				var tickets = parseInt( $(xml).find('items>item>tickets').text() ) - parseInt( $(xml).find('items>item>tickets_sold').text() );
				var price = parseInt($(xml).find('items>item>price').text());

				if ( tickets < 0 )
					tickets = 0;

				$("#addToTicketsButton").hide();
				$('#addToCartButton').hide();

				$("#clubId").html($(xml).find('items>item>object_id').text());
				$("#clubInfoName").html($(xml).find('items>item>name').text());
				$("#clubInfoDescription").html($(xml).find('items>item>description').text());
				$("#clubInfoDate").html($(xml).find('items>item>start_time').text().substr(0, 10));
				$("#clubInfoTime").html($(xml).find('items>item>start_time').text().substr(11, 5));

				$("#clubInfoVenueName").html($(xml).find('items>item>venue_name').text());
				$("#clubInfoAge").html($(xml).find('items>item>age').text());
				$("#clubInfoInfo").html($(xml).find('items>item>info').text());
				$("#clubInfoStartTime").html($(xml).find('items>item>start_time').text());

				if ( $(xml).find( 'items>item>for_sale' ).text() == 'True' )
				{

					if (price > 0) {
						$("#clubInfoPrice").html(price + '&nbsp;kr');

						if ( isLoggedIn() )
							$('#addToCartButton').show();
					}
					else {
						$("#clubInfoPrice").html('Gratis');
						$('#addToCartButton').hide();
						if ( isLoggedIn() )
							$("#addToTicketsButton").show();
					}

					if ( tickets == 0 )
					{
						$("#clubInfoTicketsAvailable").html( 'Inga biljetter tillgängliga.' );
						$('#addToCartButton').hide();
						$("#addToTicketsButton").hide();
					}
					else
					{
						if ( tickets > 10 )
							$("#clubInfoTicketsAvailable").html( '10+ biljetter kvar');
						else
							$("#clubInfoTicketsAvailable").html( tickets + ' biljetter kvar');
					}
				}
				else
				{
					$("#addToTicketsButton").hide();
					$('#addToCartButton').hide();
					$("#clubInfoPrice").html(price + '&nbsp;kr');
					$("#clubInfoTicketsAvailable").html( 'Du kan inte köpa biljetter här' );
				}

				$("#clubInfoGuestlistTicketsAvailable").html($(xml).find('items>item>guestlist_tickets_available').text());
				$("#clubInfoAddress").html($(xml).find('items>item>address').text());

				if ($(xml).find('items>item>website').text())
					$("#clubInfoWebSite").html('<a href="#" onclick="window.open( \'' + $(xml).find('items>item>website').text() + '\', \'_system\' ); return false;">Webbsida</a>');
				else
					$("#clubInfoWebSite").html('');


				if ($(xml).find('items>item>facebook').text())
					$("#clubInfoFacebook").html('<a href="#" onclick="window.open( \'' + $(xml).find('items>item>facebook').text() + '\', \'_system\' ); return false;">Öppna Facebook</a>');
				else
					$("#clubInfoFacebook").html('');

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

			}
		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadGuideList
function loadGuideList()
{

	var pars = "";
	if (window.localStorage.getItem("city") == undefined)
		pars = "";
	else
		pars = 'city_id=' + window.localStorage.getItem("city");

	$("#vertGuidePageList").empty();
	$.ajax
	(
		{
		type: "GET",
		url: getClubsUri,
		cache: false,
		async: true,
		crossDomain: true,
		data: pars,
		dataType: "xml",
		beforeSend: function(xhr) {

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var xml = $(xml);
				var lastDay = '';

				$(xml).find('item').each(
					function()
					{

						var $this = $(this);

						var tickets = parseInt($this.children('tickets').text()) - parseInt($this.children('tickets_sold').text());

						var bubble = '';
						if ( $this.children( 'for_sale' ).text() == 'True' )
						{
							if (tickets == 0) bubble = 'Slutsålt';
							else if (tickets == 1) bubble = 'En biljett';
							else if (tickets > 10) bubble = '10+ biljetter';
							else if (tickets > 1) bubble = tickets + ' biljetter';
						}


						// Lägger in dagsrubriker relativt till idag i listan
						var days = 0;

				    var start = new Date();
				    var end = new Date( $this.children('display_date').text() );

						start.setHours(0,0,0,0);
						end.setHours(0,0,0,0);
				    var days = parseInt( ( end - start )/1000/60/60/24 );

						if ( days < 0 ) dayText = 'TIDIGARE';
						else if ( days == 0 ) dayText = 'IDAG';
						else if ( days == 1 ) dayText = 'IMORGON';
						else if ( days <= 7 ) dayText = 'KOMMANDE 7 DAGAR';
						else dayText = 'LÄNGRE FRAM';

						if ( lastDay != dayText ) {

							lastDay = dayText;
							$("#vertGuidePageList").append( '<li data-role="list-divider">' + dayText + '</li>' );

						}

						// Skapa list-<li>
						var li = $('<li/>');

						if ( bubble > '' )
						{
							var a = $('<a/>',
								{
								html: '<h3>' + $this.children('name').text() + '</h3><p>' + $this.children('display_date').text() + ' - ' + $this.children('venue_name').text() + '</p><span class="ui-li-count ui-btn-corner-all" style="margin-top:-21px; background-color:#FFF; border:0px;">' + bubble + '</span></h3>',
								href: 'javascript:showClub( "' + $this.children('object_id').text() + '" )'
								}
							);
						}
						else
						{
							var a = $('<a/>',
								{
								html: '<h3>' + $this.children('name').text() + '</h3><p>' + $this.children('display_date').text() + ' - ' + $this.children('venue_name').text() + '</p>',
								href: 'javascript:showClub( "' + $this.children('object_id').text() + '" )'
								}
							);
						}

						li.append(a);
						$("#vertGuidePageList").append(li);

					}
				);

/*					,
				$("#vertGuidePageList").listview({
					autodividers:true
					autodividersSelector: function ( li ) {
						// "li" is the list item, you can get the text via li.text()
						// and then you return whatever you want - in text that is
						return li.text().substring(0,10).toUpperCase();

					}
				}).listview("refresh");
*/

				$("#vertGuidePageList").listview("refresh");

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}
		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadGuideList
function loadGuideList_x(weekday)
{

	var data = "";
	if (weekday == "undefined") weekday = '-1';

	$.ajax
	(
		{
		type: "GET",
		url: getEventsUri,
		cache: false,
		async: false,
		crossDomain: true,
		data: "weekday=" + weekday + '&category=' + window.localStorage.getItem("city"),
		dataType: "xml",
		beforeSend: function(xhr) {

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var xml = $(xml);
				var odd = false;
				var content = "";

				$(xml).find('item').each(
					function()
					{

						var $this = $(this);

						var buyButton = "";

						if (isLoggedIn() == false)
							buyButton = '<a href="javascript:loginout();" data-role="button" data-corners="false">Logga in för att köpa</a>';
						else if (! cellphoneConfirmed)
							buyButton = '<a href="#confirmCellPhonePage" data-role="button" data-corners="false">Bekräfta mobilnummer för att köpa</a>';
						else if (isLoggedIn() == true)
						{

							if (parseInt($this.children('tickets_sold').text()) < parseInt($this.children('tickets').text()))
							{

								buyButton =
								'<a href="#" onclick="WyWalletPurchase( ' + fnuffed(cellphone) + ', ' + fnuffed($this.children('entre').text()) + ', ' + fnuffed($this.children('vat').text()) + ', ' + fnuffed($this.attr('id')) + ' );" data-role="button" data-corners="false">Köp med WyWallet</a>'
								+ '<a href="#" onclick="dibsPurchase( ' + fnuffed(cellphone) + ', ' + fnuffed($this.children('entre').text()) + ', ' + fnuffed($this.children('vat').text()) + ', ' + fnuffed($this.attr('id')) + ' );" data-role="button" data-corners="false">Köp med Visa</a>';

							}

						}

						if ($this.children('facebook').text() > "")
						{

							fbButton = '<a href="#" onclick="window.open( ' + fnuff + $this.children('facebook').text() + fnuff + ', ' + fnuff + '_system' + fnuff + ' );" d_ata-role="button" d_ata-corners="false">Visa på Facebook</a>';

						}
						else
							fbButton = '';


						content = content
						+ '<div data-role="collapsible" data-corners="false" ' + iif(odd, 'data-theme="a"', 'data-theme="a"') + ' data-content-theme="a" style="margin:0px; color:white;">'
						+ '<h2 style="margin:0px; padding:0px;">'
						+ '<div style="width:80%; float:left;">'
						+ $this.children('name').text()
						+ '<br>'
						+ '<p style="margin-top:0px; margin-bottom:0px; font-size:12px;">'
						+ 'Plats: ' + $this.children('location').text()
						+ '</p>'
						+ '</div>'
						+ '</h2>'
						+ '<div>'
						+ buyButton
						+ '<p>' + $this.children('description').text() + '</p>'
						+ '<table class="np-clubs-table">'
						+ '<tr valign="top"><td style="color:#C0C0C0;">Datum</td> <td>' + $this.children('date').text() + '</td></tr>'
						+ '<tr valign="top"><td style="color:#C0C0C0;">Tid</td> <td>' + $this.children('start_time').text() + '-' + $this.children('end_time').text() + '</td></tr>'
						+ iif(($this.children('sales_start').text() > ""), '<tr valign="top"><td style="color:#C0C0C0;">Säljstart</td> <td>' + $this.children('sales_start').text().substring(0, 16) + '</td></tr>', '')
						+ iif(($this.children('sales_stop').text() > ""), '<tr valign="top"><td style="color:#C0C0C0;">Säljstopp</td> <td>' + $this.children('sales_stop').text().substring(0, 16) + '</td></tr>', '')
						+ iif(($this.children('age_male').text() > ""), '<tr valign="top"><td style="color:#C0C0C0;">Ålder</td> <td>' + $this.children('age_male').text() + ' år</td></tr>', '')
						+ iif(($this.children('location').text() > ""), '<tr valign="top"><td style="color:#C0C0C0;">Plats</td> <td>' + $this.children('location').text() + '</td></tr>', '')
						+ iif(($this.children('entre').text() > ""), '<tr valign="top"><td style="color:#C0C0C0;">Entré</td> <td>' + $this.children('entre').text() + ' kr (varav moms ' + $this.children('vat_amount').text() + ' kr) </td></tr>', '')

						//           + '<tr valign="top"><td colspan="2"><h2>NP-villkor</h2></td></tr>'
						//           + '<tr valign="top"><td nowrap style="color:#C0C0C0;">18+</td> <td>' + $this.children( 'sommarkort18' ).text() + '</td></tr>'
						//           + '<tr valign="top"><td nowrap style="color:#C0C0C0;">20+</td> <td>' + $this.children( 'sommarkort20' ).text() + '</td></tr>'
						//           + '<tr valign="top"><td nowrap style="color:#C0C0C0;">NP TIX</td> <td>' + $this.children( 'nptix' ).text() + '</td></tr>'

						+ '<tr><td colspan="2"><h2>Information</h2></td></tr>'
						+ '<tr valign="top"><td style="color:#C0C0C0;">Info</td> <td>' + $this.children('info').text() + '</td></tr>'
						+ iif(($this.children('on_stage').text() > ""), '<tr valign="top"><td style="color:#C0C0C0;">På scen</td> <td>' + $this.children('on_stage').text() + '</td></tr>', '')
						+ iif(($this.children('dj').text() > ""), '<tr valign="top"><td style="color:#C0C0C0;">DJ</td> <td>' + $this.children('dj').text() + '</td></tr>', '')
						+ '<tr valign="top" style="color:#C0C0C0;"><td>Facebook</td> <td>' + fbButton + '</td></tr>'
						+ '<tr><td colspan="2"><h2>Adress</h2></td></tr>'
						+ '<tr><td style="color:#C0C0C0;">Gata</td> <td>' + $this.children('street').text() + '</td></tr>'
						+ '<tr><td style="color:#C0C0C0;">Postnr</td> <td>' + $this.children('zipcode').text() + ' ' + $this.children('city').text() + '</td></tr>'
						+ iif(($this.children('phone').text() > ""), '<tr><td style="color:#C0C0C0;">Telefon</td> <td>' + $this.children('phone').text() + '</td></tr>', '')
						+ '</table>'
						+ '</div>'
						+ '</div>'
						;

						odd = ! odd

					}
				);

				$("#guidePageList").html(content);
				$("#guidePageList").trigger('create');

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}
		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadOffersList
function loadOffersList(element)
{

	$.ajax
	(
		{
		type: "GET",
		url: getOffersUri,
		cache: false,
		async: false,
		crossDomain: true,
		data: "",
		dataType: "xml",
		beforeSend: function(xhr) {

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var xml = $(xml);
				var odd = false;
				var content = "";

				$(xml).find('item').each(
					function()
					{

						var $this = $(this);

						var buyButton = "";

						if (isLoggedIn() == false)
							buyButton = '<a href="javascript:loginout();" data-role="button" data-corners="false">Logga in för att hämta erbjudandet</a>';
						else if (! cellphoneConfirmed)
							buyButton = '<a href="#confirmCellPhonePage" data-role="button" data-corners="false">Bekräfta mobilnummer för att hämta erbjudandet</a>';
						else if (isLoggedIn() == true)
						{

							buyButton = '<a href="#" onclick="WyWalletPurchase( ' + fnuffed(cellphone) + ', ' + fnuffed($this.children('entre').text()) + ', ' + fnuffed($this.children('vat').text()) + ', ' + fnuffed($this.attr('id')) + ' );" data-role="button" data-corners="false">Köp med WyWallet</a>';

						}

						if ($this.children('facebook').text() > "")
						{

							fbButton = '<a href="#" onclick="window.open( ' + fnuff + $this.children('facebook').text() + fnuff + ', ' + fnuff + '_system' + fnuff + ' );" d_ata-role="button" d_ata-corners="false">Visa på Facebook</a>';

						}
						else
							fbButton = '';


						content = content
						+ '<div data-role="collapsible" data-corners="false" ' + iif(odd, 'data-theme="a"', 'data-theme="a"') + ' data-content-theme="a" style="margin:0px; color:white;">'
						+ '<h2 style="margin:0px; padding:0px;">'
						+ '<div style="width:80%; float:left;">'
						+ $this.children('name').text()
						+ '<br>'
						+ '<p style="margin-top:0px; margin-bottom:0px; font-size:12px;">'
						+ 'Säljställe: ' + $this.children('location').text()
						+ '</p>'
						+ '</div>'
						+ '</h2>'
						+ '<div>'
						+ buyButton
						+ '<p>' + $this.children('description').text() + '</p>'
						+ '<table class="np-clubs-table">'
						+ '<tr><td colspan="2"><h2>Information</h2></td></tr>'
						+ '<tr valign="top"><td style="color:#C0C0C0;">Info</td> <td>' + $this.children('info').text() + '</td></tr>'
						+ '<tr valign="top" style="color:#C0C0C0;"><td>Facebook</td> <td>' + fbButton + '</td></tr>'
						+ '</table>'
						+ '</div>'
						+ '</div>'
						;

						odd = ! odd

					}
				);

				element.html(content);
				element.trigger('create');

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}
		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadAccount
function loadAccount()
{

	$.ajax(
		{
		type: "GET",
		url: getNewslettersUri,
		cache: false,
		async: false,
		data: "",
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var content = "";
				var li = "";

				//    $( "#div-newsletters" ).empty();

				var ul = $("#ul-newsletter");
				ul.empty();

				$(xml).find('item').each(
					function()
					{

						var $this = $(this);
						var state = 'CHECKED';
						if (userId > '') state = '';

						var chk = $('input/>',
							{
							id: 'newsletter_' + $this.children('code').text(),
							type: 'checkbox',
							value: 'ON'
							}
						);

						var lbl = $('label',
							{
							for: 'newsletter_' + $this.children('code').text(),
							html: $this.children('name').text()
							}
						);

						var li = $("<li/>"); //$('<li/>');
						li.append(chk);
						li.append(lbl);
						li.append('<input id="newsletter_' + $this.children('code').text() + '" type="checkbox"><label for="newsletter_' + $this.children('code').text() + '">' + $this.children('name').text() + '</label>');

						ul.append(li);

						//      content = content
						//       + '<input type="checkbox" id="newsletter_' + $this.children( 'code' ).text() + '" value="ON" ' + state + '>'
						//       + '<label for="newsletter_' + $this.children( 'code' ).text() + '">' + $this.children( 'name' ).text() + '</label>';


					}
				);

				//    ul.listview( "refresh" );
				ul.trigger("create");
				if (! isLoggedIn())
					$("input[type='checkbox']").attr("checked", true).checkboxradio("refresh");

				//    $( "#ul-newsletter" ).trigger( "create" );
				//    $("#ul-newsletter").listview("refresh").find('input').checkboxradio();
				//    $("#ulTest").listview("refresh").find('input').checkboxradio();

				//    $( "#div-newsletters" ).html( content );
				//    $( "#div-newsletters" ).trigger('create');

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

	$.ajax(
		{
		type: "GET",
		url: getAccountUri,
		cache: false,
		async: false,
		data: "",
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				$("#firstName").val($(xml).find("item>first_name").text());
				$("#lastName").val($(xml).find("item>last_name").text());
				$("#personalId").val($(xml).find("item>personalno").text());

				if ($(xml).find("item>gender").text() == 'MALE')
					$("#gender_male").attr("checked", true); //.checkboxradio("refresh");
				if ($(xml).find("item>gender").text() == 'FEMALE')
					$("#gender_female").attr("checked", true); //.checkboxradio("refresh");

				$("#address").val($(xml).find("item>street").text());
				$("#zipcode").val($(xml).find("item>zipcode").text());
				$("#city").val($(xml).find("item>city").text());
				$("#email").val($(xml).find("item>email").text());
				$("#cellPhone").val($(xml).find("item>cellphone").text());

				if (isLoggedIn()) $("#agreement").attr("checked", true).checkboxradio("refresh");
				else $("#agreement").attr("checked", false).checkboxradio("refresh");

				var newsletters = $(xml).find("item>newsletters").text();
				var newsletter_array = newsletters.split("\n");

				for (var i = 0; i < newsletter_array.length; i++) {

					$("#newsletter_" + newsletter_array[i].toUpperCase()).attr("checked", true).checkboxradio("refresh");

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadAccount
function loadUserAgreement()
{

	$.ajax(
		{
		type: "GET",
		url: getUserAgreementUri,
		cache: false,
		async: false,
		data: "",
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				if ($(xml).find("result>code").text() == 'SUCCESS')
					$("#userAgreementPageTop").html($(xml).find("result>data").text());
				else
					$("#userAgreementPageTop").html("De allmänna villkoren kunde inte hämtas just nu. Försök igen senare.");

				$("#userAgreementPageTop").trigger('create');


			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$("#userAgreementPageTop").html("<h2>Ett fel uppstod</h2><p>De allmänna villkoren kunde inte hämtas just nu. Försök igen senare.</p> " + errorThrown);

			}

		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- loadSupport
function loadSupportPageTop()
{

	$.ajax(
		{
		type: "GET",
		url: getSupportPageUri,
		cache: false,
		async: false,
		data: "",
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				if ($(xml).find("result>code").text() == 'SUCCESS')
					$("#supportPageTop").html($(xml).find("result>data").text());
				else
					$("#supportPageTop").html("Supportsidan kunde inte hämtas just nu. Försök igen senare.");

				if (userId > "") $("#email").val(userId);

			},
		error: function(XMLHttpRequest, textStatus, errorThrown)
			{

				$("#supportPageTop").html("<h2>Ett fel uppstod</h2><p>Supportsidan kunde inte hämtas just nu. Försök igen senare.</p> " + errorThrown);

			}

		}
	);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- Logout
function logout()
{

	userId = "";
	password = "";
	window.localStorage.removeItem("userId");
	window.localStorage.removeItem("password");
	window.localStorage.removeItem("role");

	refreshControls();
	$.mobile.changePage("#loginPage");
//	location.reload(true);

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- Logout
function loginout()
{

	if (userId == null) {

		$.mobile.changePage("#loginPage");

	}
	else {

		$.mobile.changePage("#logoutPage");

	}

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- changeButtonText
(function($)
	{
		/*
   * Changes the displayed text for a jquery mobile button.
   * Encapsulates the idiosyncracies of how jquery re-arranges the DOM
   * to display a button for either an <a> link or <input type="button">
   */
		$.fn.changeButtonText = function(newText) {
			return this.each(function()
				{
					$this = $(this);
					if($this.is('a')) {
						$('span.ui-btn-text', $this).text(newText);
						return;
					}
					if($this.is('input')) {
						$this.val(newText);
						// go up the tree
						var ctx = $this.closest('.ui-btn');
						$('span.ui-btn-text', ctx).text(newText);
						return;
					}
				}
			);
		};
	}
)(jQuery);
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- accountForm submition
//$("#accountForm").submit(function(event) {
function postAccount()
{

	if (!validateAccountForm()) return false;

	var params = $("#accountForm").serialize();
	var c = "";

	for (var i = 0; i < newsLetters.length; i++) {

		var n = newsLetters[i].split("=");

		if ($("#newsletter_" + n[0]).is(':checked'))
			c = c + n[0] + ',';

	}

	if (newsLetters > "")
		params = params + '&newsletters=' + c;

	$.ajax(
		{
		type: "POST",
		url: postAccountUri,
		data: params,
		async: true,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var resCode = $(xml).find('nattpasset>result>code').text();
				var resEmail = $(xml).find('nattpasset>result>email').text();

				if (resCode == resSuccess)
				{

					userId = resEmail;
					window.localStorage.setItem("userId", resEmail);

					$.mobile.changePage('#accountSavedPage');

				}
				else
				{

					var resDescription = $(xml).find('result>description').text();
					errorPage("Vi misslyckades att spara uppgifterna i ditt konto. Se beskrivningen nedan, åtgärda problemet och försök igen.", resDescription);

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

}


// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- supportForm submit
$("#supportForm").submit(function(event)
	{

		$.ajax(
			{
			type: "POST",
			url: postSupportUri,
			data: $(this).serialize(),
			success: function(xml) {

					var resCode = $(xml).find("result>code").text();

					if (resCode == resSuccess) {

						infoPage("Tack för din fråga", "Vi återkommer till dig med svar så fort vi kan", "#supportPage", "Tillbaks")

					}
					else {

						errorPage('Fel', errorThrown, 'Tillbaka');

					}

				},
			error: function(XMLHttpRequest, textStatus, errorThrown) {

					$.mobile.changePage( '#servicePage' );

				},
			complete: function()
				{

					location.reload();

				}

			}
		);

	}
);
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- validateAccountForm
function validateAccountForm()
{

	var faults = "";


	if (! $("#accAgreement").is(":checked"))
	{

		alert("Du måste acceptera NattPassets användarvillkor.");
		return false;

	}

	if ($("#firstName").val() == "") faults = faults + "- Ange förnamn\r";
	if ($("#lastName").val() == "") faults = faults + "- Ange efternamn\r";

	if ((! $("#noPersonalId").is(":checked")) && (! checkPersonalNoField($("#personalId")))) faults = faults + "- Ange personnummer\r";


	if ($("#address").val() == "") faults = faults + "- Ange adress\r";
	if ($("#zipcode").val() == "") faults = faults + "- Ange postnummer\r";
	if ($("#email").val() == "") faults = faults + "- Ange epost\r";
	if ($("#cellPhone").val() == "") faults = faults + "- Ange mobilnummer\r";

	if (faults > "")
	{

		faults = "Ett eller flera fält har inte fyllts i\r\r" + faults;
		errorPage("Valideringsfel", faults);
		return false;

	}

	return true;

}


// ----------------------------------------------------------------------------- validateSupportForm
function validateSupportForm()
{

	var faults = "";


	if ($("#contactEmail").val() == "") faults = faults + "- Ange din epostadress\r";
	if ($("#description").val() == "") faults = faults + "- Ange en fråga eller ett meddelande\r";

	if (faults > "")
	{

		faults = "Ett eller flera fält har inte fyllts i\r\r" + faults;
		errorPage("Valideringsfel", faults);
		return false;

	}

	return true;

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- validateChangePasswordForm
function validateChangePasswordForm()
{

	var faults = "";


	if ($("#newPassword").val() == "") faults = faults + "- Ange det nya lösenord\r";
	if ($("#confirmPassword").val() == "") faults = faults + "- Bekräfta det nya lösenordet\r";
	if ($("#newPassword").val() != $("#confirmPassword").val()) faults = faults + "- Det bekräftade lösenordet stämmer inte\r";

	if (faults > "")
	{

		faults = "Valideringsfel\r\r" + faults;
		errorPage("Valideringsfel", faults);
		return false;

	}

	return true;

}
// -----------------------------------------------------------------------------


// ----------------------------------------------------------------------------- validateUser
function validateUser(authUserId, authPassword)
{

	var ok = false;

	$.ajax(
		{
		type: "GET",
		url: loginPostUri,
		data: 'userId=' + authUserId + '&password=' + authPassword, //values,
		async: false,
		success: function(xml) {

				var resCode = $(xml).find("result>code").text();
				var resRole = $(xml).find("result>role").text();


				if (resCode == resSuccess) {

					window.localStorage.setItem("userId", authUserId);
					window.localStorage.setItem("password", authPassword);
					window.localStorage.setItem("role", resRole);

					userId = authPassword;
					password = authPassword;
					role = resRole;

					ok = true;

					$.mobile.changePage('#homePage');
					location.reload();

				}
				else {

					errorPage("Inloggning misslyckades", "Inloggningen misslyckades, har du angivit rätt epost och lösenord?", "Logga in");

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

			}
		}
	);


	return ok;

}
// -----------------------------------------------------------------------------


function dibsPurchase(order_id, termsChecked )
{

	//alert( 'dibsPurchase: ' + order_id );

	if ( ! termsChecked ) {

		alert( 'Du måste godkänna köpvillkoren.' );
		return false;

	}

	var ref = window.open(webServiceUrl + 'purchase?payment_handler=DIBS&email=' + userId + '&order_id=' + order_id, '_blank', 'location=no');
	ref.addEventListener('loadstop',
		function(event) {
			if (event.url.indexOf("purchaseSucceeded") > 0)
				setTimeout(
					function()
					{
						$.mobile.changePage('#ticketsPage');
						ref.close();
					},
					5000);
			if (event.url.indexOf("purchaseFailed") > 0)
				setTimeout(
					function()
					{
						$.mobile.changePage('#guidePage');
						ref.close();
					},
					5000);
		}

	);

}

function addCartToTickets( cart_id, termsChecked )
{

//	alert( 'addCartToTickets: ' + cart_id );

	if ( ! termsChecked ) {

		alert( 'Du måste godkänna användarvillkoren.' );
		return false;

	}

	$.post(
		addCartToTicketsUri,
		'cart_id=' + cart_id,
		function( xml )
		{

			var resCode = $(xml).find("code").text();
			var resDescription = $(xml).find("description").text();

			if ( resCode == resFault )
			{
				alert( resDescription );
				return false;
			}

			$.mobile.changePage('#ticketsPage');

		},
		'xml'
	);

}

function checkPersonalNoField(element)
{

	var ok = false;
	var pno = element.val();

	// NP-512 Ric 2014-07-11
	// Validering av postnummer justerat
//  0123 45 6789
//	1966 09 18-1273
	var year = parseInt( pno.substring( 0, 2 ) );
	var month = parseInt( pno.substring( 4, 6 ) );
	var day = parseInt( pno.substring( 6, 8 ) );

	if ( ( pno.length >= 12 )
		&& ( ( year == 19 ) || ( year == 20 ) )
		&& ( ( month >= 1 && month <= 12 ) )
		&& ( ( day >= 1 && day <= 31 ) )
	)	{
		ok = true;
	}
	else 	{
		ok = false;
	}

	return ok;

}

function validateRegistrationForm(onOk, onFaults)
{

	var valid = true;

	$("#personalid-label").removeClass("np-error-field");
	$("#cellphone-label").removeClass("np-error-field");
	$("#email-label").removeClass("np-error-field");


	if ($("#regCellphone").val() == "")
	{
		$("#cellphone-label").addClass("np-error-field");
		valid = false;
	}

	if ($("#regNoPersonalId").is(":checked") == false) {

		if (! checkPersonalNoField($("#regPersonalId"))) {

			$("#personalid-label").addClass("np-error-field");
			valid = false;

		}

	}

	if ($("#regEmail").val() == "")
	{
		$("#email-label").addClass("np-error-field");
		valid = false;
	}

	if (valid == true) onOk(); else onFaults();

}

function postRegistration(formName)
{

	validateRegistrationForm(
		function() {

			$.ajax(
				{
				type: "POST",
				url: postRegistrationUri,
				data: $("#" + formName).serialize(),
				async: false,
				crossDomain: true,
				dataType: "xml",
				success: function(xml)
					{

						var resCode = $(xml).find('result>code').text();
						var resDescription = $(xml).find('result>description').text();
						var resUserId = $(xml).find('result>id').text();
						var resPassword = $(xml).find('result>password').text();

						if (resCode == resSuccess)
						{
							//alert( resUserId + "/" + resPassword );
							validateUser(resUserId, resPassword)
							//      $.mobile.changePage( '#accountCreatedPage' );

						}
						else
						{

							var resDescription = $(xml).find('result>description').text();
							errorPage('Fel', resDescription, 'Tillbaka');

						}

					},
				error: function(XMLHttpRequest, textStatus, errorThrown) {

					$.mobile.changePage( '#servicePage' );

					}

				}
			);

		},
		function() {

			errorPage('Fel', "Ett eller flera fält är felaktigt ifyllda", 'Tillbaka');

		}

	);

}


function addToCart(product_id)
{

	// alert( product_id );

	$.ajax(
		{
		type: "POST",
		url: postOrderUri,
		data: 'order_id=' + window.localStorage.getItem('cart_id') + '&productId=' + product_id,
		async: false,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var resCode = $(xml).find('result>code').text();

				if (resCode == resSuccess)
				{

					//alert( $(xml).find( 'result>cart_id' ).text() );
					window.localStorage.setItem('cart_id', $(xml).find('result>cart_id').text());
					$.mobile.changePage('#cartPage');

				}
				else
				{

					var resDescription = $(xml).find('result>description').text();
					errorPage('Fel', resDescription, 'Tillbaka');

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );
				$('#errorDiv').html( textStatus + '/' + errorThrown );

			}

		}
	);

}

function addToTickets(product_id)
{

	// alert( product_id );

	$.ajax(
		{
		type: "POST",
		url: postTicketUri,
		data: 'productId=' + product_id,
		async: false,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var resCode = $(xml).find('result>code').text();

				if (resCode == resSuccess)
				{

					$.mobile.changePage('#ticketsPage');

				}
				else
				{

					var resDescription = $(xml).find('result>description').text();
					errorPage('Fel', resDescription, 'Tillbaka');

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

}

function addProduct(row_id)
{
	//alert( row_id );

	$.ajax(
		{
		type: "POST",
		url: postAddToCartUri,
		data: 'order_row_id=' + row_id,
		async: true,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var resCode = $(xml).find('result>code').text();

				if (resCode == resSuccess) {
					loadCart();
				}
				else {

					$('#popupCartError p').html( 'Det finns inga fler biljetter tillgängliga till evenemanget' );
					$('#popupCartError').popup('open');
					setTimeout( function() { $('#popupCartError').popup('close'); }, 3000 )

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage('#verticalGuidePage');

			}

		}
	);

}

function removeProduct(row_id)
{
	//alert( row_id );

	$.ajax(
		{
		type: "POST",
		url: postRemoveFromCartUri,
		data: 'order_row_id=' + row_id,
		async: true,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				loadCart();

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage('#verticalGuidePage');

			}

		}
	);

}

function loadCart()
{

	var cartId = window.localStorage.getItem('cart_id');
	$(".cart-button").hide();

	$.ajax(
		{
		type: "GET",
		url: getCartUri,
		data: 'order_id=' + cartId,
		async: false,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var total = 0;
				var items = 0;

				$(".cartItemsTable tr").remove();

/*
				$('.cartItemsTable').append(
					'<tr>'
					+ '	<td><b>Event</b></td>'
//					+ '	<td align="center" colspan="3"><b>Antal</b></td>'
					+ '	<td align="right" colspan="3"><b>Pris</b></td>'
					+ '</tr>'
				);
				$('.cartItemsTable').append(
					'<tr>'
					+ '	<td><b>Event</b></td>'
					+ '	<td align="right" colspan="3"><b>Pris</b></td>'
					+ '</tr>'
				);
*/
				$(xml).find('carts>cart>rows>row').each(
					function()
					{

						$('.cartItemsTable').append(
							'<tr>'
							+ '<td class="cartItemsName">' + $(this).find('name').text() + '</td>'
							+ '<td class="cartItemsAmount" align="right">' + $(this).find('amount').text() + '&nbsp;kr</td>'
							+ '<td align="right"><img src="img/button_red_remove.png" onclick="removeProduct( \'' + $(this).attr('id') + '\')"></td>'
							+ '<td align="left"><img src="img/button_green_add.png" onclick="addProduct( \'' + $(this).attr('id') + '\')"></td>'
							+ '</tr>'
						);
						items = items + 1;
/*
						$('.cartItemsTable').append(
							'<tr>'
							+ '	<td align="right" colspan="2"><img src="img/button_red_remove.png" onclick="removeProduct( \'' + $(this).attr('id') + '\')"> <img src="img/button_green_add.png" onclick="addProduct( \'' + $(this).attr('id') + '\')"> </td>'
							+ '</tr>'
						);
*/
/*
						$('.cartItemsTable').append(
							'<tr><td class="cartItemsName">' + $(this).find('name').text() + '</td>'
							+ '<td align="right"><img src="img/button_red_remove.png" onclick="removeProduct( \'' + $(this).attr('id') + '\')"></td>'
//							+ '<td class="cartItemsItems" align="center">' + $(this).find('items').text() + '</td>'
							+ '<td align="left"><img src="img/button_green_add.png" onclick="addProduct( \'' + $(this).attr('id') + '\')"></td>'
							+ '<td class="cartItemsAmount" align="right">' + $(this).find('amount').text() + '&nbsp;kr</td></tr>'
						);
*/
						total = total + parseInt($(this).find('amount').text());

					}
				);

				$('.cartItemsTable').append(
					'<tr>'
					+ '<td>Totalt</td>'
					+ '<td align="right">' + total + '&nbsp;kr</td>'
					+ '</tr>'
				);
/*
				$('.cartItemsTable').append(
					'<tr>'
					+ '<td colspan="3">Totalt</td>'
					+ '<td align="right">' + total + '&nbsp;kr</td>'
					+ '</tr>'
				);
*/

				// Hide button
				if (total > 0) $("#payCartButton").show();
				else $("#payCartButton").hide();

				if ( total == 0 && items > 0 ) $("#addCartButton").show();
				else $("#addCartButton").hide();

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

}

function getOptOuts()
{

	if (! isLoggedIn()) return true;

	$.ajax(
		{
		type: "get",
		url: getOptOutsUri,
		data: '',
		async: true,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var resCode = $(xml).find('result>code').text();

				if (resCode == resSuccess)
				{

					if ($(xml).find('result>optout_reply').text() > '')
					{
						$("input[id='optout-facebook']").attr("checked", ($(xml).find('result>optout_facebook').text() == 'True')).checkboxradio("refresh");
						$("input[id='optout-push']").attr("checked", ($(xml).find('result>optout_push').text() == 'True')).checkboxradio("refresh");
					}
					else
					{
						$("input[id='optout-facebook']").attr("checked", true).checkboxradio("refresh");
						$("input[id='optout-push']").attr("checked", true).checkboxradio("refresh");
					}

					if ($(xml).find('result>optout_reply').text() > '')
						$("#optOut").hide();
					else
						$("#optOut").show();

				}
				else
				{

					var resDescription = $(xml).find('result>description').text();
					errorPage("Vi misslyckades att hämta dina inställningar. Se beskrivningen nedan, åtgärda problemet och försök igen.", resDescription);

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

}
function setOptOuts()
{

	data = 'optout_facebook=' + $('#optout-facebook').is(":checked");
	data += '&optout_push=' + $('#optout-push').is(":checked");

	$.ajax(
		{
		type: "post",
		url: postOptOutsUri,
		data: data,
		async: true,
		crossDomain: true,
		dataType: "xml",
		beforeSend: function(xhr)
			{

				setHeaders(xhr);

			},
		success: function(xml)
			{

				var resCode = $(xml).find('result>code').text();

				if (resCode == resSuccess)
				{

					if ($(xml).find('result>code').text() == 'SUCCESS')
						$("#optOut").hide();
					else
						$("#optOut").show();

				}
				else
				{

					var resDescription = $(xml).find('result>description').text();
					errorPage("Vi misslyckades att ändra dina inställningar. Se beskrivningen nedan, åtgärda problemet och försök igen.", resDescription);

				}

			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

			}

		}
	);

}
function onDeviceReady() {
	document.addEventListener("backbutton", function(e)
		{
			if($.mobile.activePage.is('#homePage')) {
				e.preventDefault();
				navigator.app.exitApp();
			}
			else {
				navigator.app.backHistory()
			}
		}, false
	);
}
$(document).on("pagecreate", "#homePage", function()
	{
		$(document).on("swipeleft swiperight", "#homePage", function(e)
			{
				// We check if there is no open panel on the page because otherwise
				// a swipe to close the left panel would also open the right panel (and v.v.).
				// We do this by checking the data that the framework stores on the page element (panel: open).
				if ($(".ui-page-active").jqmData("panel") !== "open") {
					if (e.type === "swipeleft") {
						$("#valjstad").panel("open");
					} else if (e.type === "swiperight") {
						$("#menuPanel1").panel("open");
					}
				}
			}
		);
	}
);


/*
	Redeems a voucher
*/
function addVoucherCode( cartId, voucherCode )
{

	$.post(
		voucherUri,
		'cart_id=' + cartId + '&voucher_code=' + voucherCode,
		function(data)
		{

			var xml = $(data);

			//    alert($(xml).find('code').text() );
			if ($(xml).find('code').text() == resFault)
			{

				$('#popupCartError p').html( $(xml).find('description').text() );
				$('#popupCartError').popup('open');
				setTimeout( function() { $('#popupCartError').popup('close'); }, 3000 )

			}
			else
				location.reload( true );

		},
		'xml'
	);

}

function login()
{

	var authUserId = $("#loginUserId").val();
	var authPassword = $("#loginPassword").val();

	if (validateUser(authUserId, authPassword))
	{
//		registerAppForPush();
		refreshControls();
		$.mobile.changePage('#homePage');
	}
	else
		return false;

}


$("#changePasswordForm").submit(function(event)
	{

		$.ajax(
			{
			type: "POST",
			url: changePasswordUri,
			data: $(this).serialize(),
			beforeSend: function(xhr)
				{

					setHeaders(xhr);

				},
			success: function(xml) {

					var resCode = $(xml).find("result>code").text();
					var resDescription = $(xml).find("result>description").text();

					if (resCode == resSuccess) {

						infoPage("Nytt lösenord", "Ditt\tlösenord har nu\tändrats", "#homePage", "");

					}
					else {

						errorPage("Misslyckades", "", "#homePage", "");

					}

				},
			error: function(XMLHttpRequest, textStatus, errorThrown) {

				$.mobile.changePage( '#servicePage' );

				},
			complete: function()
				{

					location.reload();

				}

			}
		)

	}
);

/*
Scroll panelinside
*/
$('.panelinside').css({
    'height': ($(document).height()) + 'px'
});

$(window).resize(function () {
    $('.panelinside').css({
        'height': ($(document).height()) + 'px'
    });
});
