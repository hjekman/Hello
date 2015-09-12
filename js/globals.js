
// Enable cross-domain requests
jQuery.support.cors = true;

var online = true;

// Some app variables
if ( mode == 'debug' )
	var webServiceUrl = "http://npapp.local:8081/";
else if ( mode == 'test' )
	var webServiceUrl = "http://utv.nattpasset.com:8080/";
else
	var webServiceUrl = "http://ws.nattpasset.com:8080/";

var getInitUri = webServiceUrl + "init";
var getClubsUri = webServiceUrl + "clubs";
var getCartUri = webServiceUrl + 'cart';
var postOrderUri = webServiceUrl + 'orders';
var postTicketUri = webServiceUrl + 'ticket';
var postAddToCartUri = webServiceUrl + 'addToCart';
var postRemoveFromCartUri = webServiceUrl + 'removeFromCart';
var getOptOutsUri = webServiceUrl + 'optOut';
var postOptOutsUri = webServiceUrl + 'optOut';
var voucherUri = webServiceUrl + 'voucher';
var addCartToTicketsUri = webServiceUrl + 'addCartToTickets';

var loginPostUri = webServiceUrl + "validateLogin";
var getAccountUri = webServiceUrl + "accounts";
var postAccountUri = webServiceUrl + "accounts";
var postRegistrationUri = webServiceUrl + "registration";
var resetPasswordUri = webServiceUrl + "resetPassword";
var getHomePageUri = webServiceUrl + "homePage";
var getProductsTopUri = webServiceUrl + "productsTop";
var getProductsUri = webServiceUrl + "products";
var getHomePageNewsUri = webServiceUrl + "news";
var getProductUri = webServiceUrl + "products";
var getPurchaseUri = webServiceUrl + "makePurchase";
var getTicketsTopUri = webServiceUrl + "ticketsTop";
var getTicketsUri = webServiceUrl + "tickets";
var getMessagesUri = webServiceUrl + "messages";
var getOffersUri = webServiceUrl + "offers";
var getUserAgreementUri = webServiceUrl + "userAgreement";
var getSupportPageUri = webServiceUrl + "supportPage";
var getBarcodeUri = webServiceUrl + "barCode";
var getBannerUri = webServiceUrl + "banner";
var postSupportUri = webServiceUrl + "support";
var getNewslettersUri = webServiceUrl + "newsletters";
var getZipcodesUri = webServiceUrl + "zipcode";
var swipeCodeUrl = webServiceUrl + "swipe";
var getAdmClubsListUrl = webServiceUrl + "admClubs";
var changePasswordUri = webServiceUrl + "changePassword";
var getHomePageScreenUri = webServiceUrl + "homePageScreen";
var tearTicketUri = webServiceUrl + 'tearticket';
var wyWalletPurchaseUri = webServiceUrl + 'WyWalletPurchase';
var confirmCellPhoneURL = webServiceUrl + 'smsSendConfirmation';
var cellPhoneInfoUri = webServiceUrl + 'cellPhoneInfo';
var resendConfirmationSMSURL = webServiceUrl + 'resendConfirmationSMS';
var wsGetVerticalGuideURL = webServiceUrl + 'verticalGuideList';
var wsRegisterAppForPushURL = webServiceUrl + 'registerPushId';
var wsGetCitiesURL = webServiceUrl + 'cities';

var registrationURL = "http://nattpasset.se/shop/sv/registrering"; // "";
var accountURL = "http://nattpasset.se/shop/sv/registrering?back=my-account";
var passwordRecoveryURL = "http://NattPasset.se/shop/sv/password-recovery"; // "#changePasswordPage";

var facebookAppId = "153347458146940";
var deviceId = "";

var resSuccess = 'SUCCESS';
var resFault = 'FAULT';

// Menu button captions
var btnHome = "Hem";
var btnProducts = "Produkter";
var btnTickets = "Biljetter";
var btnGuide = "Klubbguiden";
var btnLogin = "Logga in";
var btnLogout = "Logga ut";
var btnAccount = "Konto";
var btnRegister = "Registrering";
var btnAdmin = "Admin";
var btnSupport = 'Support';
var homePageName = '#homePage';
var productsPageName = '#productsPage';
var ticketsPageName = '#ticketsPage';
var guidePageName = '#guidePage';
var supportPageName = '#supportPage';
var adminPageName = '#adminPage';


var headerHTML = '<img src="img/title.png" width="96" height="25" alt="">';

// DIBS Payment
var mobilePaymentWindowURL = "https://mopay.dibspayment.com/";

// Paypal payment
var payPalMobileCheckout = "https://mobile.paypal.com/wc?t=";

var userId = window.localStorage.getItem( "userId" );
var password = window.localStorage.getItem( "password" );
var role = window.localStorage.getItem( "role" );
var newsLetters = new Array();

var fnuff=String.fromCharCode(39);
var cellphone = "";
var cellphoneConfirmed = false;
var account_id = "";
var first_name = "";
var last_name = "";
var email = "";
var min_app_version = "";
var city = "";

var header =
	'	<div data-role="header" data-position="fixed" style="height:38px;"> '
+ '		<a href="#menuPanel" data-role="button" data-icon="grid" data-corners="false" data-iconpos="top" style="width:30px; height:30px; float:left;"></a>'
+ '		<a href="#" data-icon="back" data-corners="false" data-rel="back" style="clear:both;">Tillbaks</a>'
+ '	</div>'
+ '	<div id="menuPanel" data-role="panel" data-position="left" data-display="push" data-dismissible="true" data-theme="a">'
+ '		<h1>NattPasset</h1>'
+ '		<ul class="drawerListView" data-role="listview">'
+ '			<li data-role="list-divider"></li>'
+ '			<li><a href="javascript:loginout();" class="ui-btn-right np-ui-login-button">Logga in</a></li>'
+ '			<li><a href="javascript:account();" class="np-ui-account-button">Konto/Registrering</a></li>'
+ '			<li><a href="javascript:showOptout();">Opt out</a></li>'
+ '			<li><a id="np-ui-facebook-button" class="np-ui-facebook-button" data-icon="custom" data-corners="false" href="#facebookAttachPage" >Facebook</a></li>'
+ '			<li data-role="list-divider"></li>'
+ '			<li><a href="#supportPage">Om NattPasset/hj&auml;lp</a></li>'
+ '			<li><a href="javascript:openExternal( \'http://www.nattpasset.se/om-oss/cookies-allmanna-villkor\' );">Anv&auml;ndarvillkor</a></li>'
+ '			<li class="np-li-manager" data-role="list-divider">Administrat&ouml;rer och klubbar</li>'
+ '			<li class="np-li-manager" ><a href="#scanPage">Scanna entr&eacute;er</a></li>'
+ '			<li data-role="list-divider"></li>'
+ '			<li data-icon="delete" data-iconpos="left"><a href="#" data-rel="close" data-icon="delete" data-iconpos="left" data-inline="false" data-corners="false">St&auml;ng</a></li>'
+ '		</ul>'
+ '	</div>';

var footer =
	'	<div data-role="footer" data-position="fixed" data-theme="a"> '
+ '		<div data-role="navbar" data-position="fixed"> '
+ '			<ul> '
+ '				<li><a href="#homePage">Hem</a></li> '
+ '				<li><a href="#ticketsPage">Mina Biljetter</a></li> '
+ '			</ul> '
+ '		</div><!-- /navbar --> '
+ '	</div><!-- /footer --> ';
