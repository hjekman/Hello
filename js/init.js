	var pushIsRegistered = false;

  $(document).bind("mobileinit", function()
    {

      $.mobile.allowCrossDomainPages = true;
      $.mobile.defaultPageTransition = "slidefade";
//			$.mobile.pushStateEnabled = false;

    }
  );

  $(document).ready(function()
    {

      $.mobile.allowCrossDomainPages = true;
      $.mobile.defaultPageTransition = "slidefade";

    }
  );

  $( document ).on( "pageinit", function( event ) {

    if (navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)) {
        $("body").addClass("ios7");
        $('body').append('<div id="ios7statusbar"/>');
	    }
   }
  );

  $(document).on("pagebeforeshow", function(event) {

		registerAppForPush( window.localStorage.getItem("device_id"), window.localStorage.getItem("os_type") );

		setSizes();
		loadCities();

		if ( isLoggedIn() ) {
			$(".messagesMenuButton").show();
		}
		else {
			$(".messagesMenuButton").hide();
		}

  } );

  $(document).on("pageshow", "#homePage", function(event)
		{

			refreshControls();
			refreshState();

			if (min_app_version >= appVersion)
			{

				$('#minAppVersion').html(min_app_version);
				$.mobile.changePage('#upgradeNoticePage');

			}

			var cityName = window.localStorage.getItem( "cityName");
			if ( cityName == null ) cityName = "Alla städer";
			$(".cityName").html( cityName );

			getOptOuts();

    }
  );
  $(document).on("pageshow", "#ticketsPage", function(event)
    {

      loadTicketsPage();

    }
  );
  $(document).on("pageshow", "#messagesPage", function(event)
		{

      loadMessagesPage();

		}
	);
  $(document).on("pageshow", "#verticalGuidePage", function(event)
    {

			loadGuidePage();

    }
  );
  $(document).on("pageshow", "#offersPage", function(event)
    {

      loadOffersList($("#offersList"));

    }
  );
  $(document).on("pageshow", "#userAgreementPage", function(event)
    {

      loadUserAgreementPage();

    }
  );
  $(document).on("pageshow", "#supportPage", function(event)
    {

      loadSupportPage();

    }
  );
  $(document).on("pageshow", "#accountPage", function(event)
    {

      loadAccountPage();

    }
  );
  $(document).on("pageshow", "#adminPage", function(event)
    {

      loadAdminPage();

    }
  );
  $(document).on("pageshow", "#scanPage", function(event)
    {

      loadScanPage();

    }
  );
  $(document).on("pagebeforeshow", "#clubDetailsPage", function(event)
    {

      loadClubDetails();
			if ( isLoggedIn() ) {
				$(".showWhenLoggedin").show();
				$(".hideWhenLoggedin").hide();
			}
			else {
				$(".showWhenLoggedin").hide();
				$(".hideWhenLoggedin").show();
			}

    }
  );
  $(document).on("pageshow", "#cartPage", function(event)
    {

      loadCart();

    }
  );

  $(document).on("pageshow", "#loginPage", function(event)
    {

      $('#userId').val(userId);
      if ($("#forgotPasswordButton").value = "")
        $("#forgotPasswordButton").button("disable");

    }
  );
  $(document).on("pageshow", "#facebookAttachPage", function(event)
    {

      setTimeout(
        function()
        {

          facebookInit();

          FB.getLoginStatus(
            function(response)
            {

              if (response.status == 'connected')
              {

                $("#facebookLoginButton").hide();
                $("#facebookLogoutButton").show();

              }
              else
              {

                $("#facebookLoginButton").show();
                $("#facebookLogoutButton").hide();

              }
            }
          );
        },
        50
      );

    }
  );

  window.addEventListener("orientationchange", function()
    {

      if (window.orientation == 0) $('.np-ui-banner-image').show();
      else $('.np-ui-banner-image').hide();

    }, false
  );

  $(document).on("pageshow", function(event)
    {

			if (mode == 'test') $(".testBuild").html('Test Build - version ' + appVersion);
			else if (mode == 'debug') $(".testBuild").html('Debug Build - version ' + appVersion);
			else $(".testBuild").hide();
			$(".confirmCellPhone").hide();


      if ( role == "" ) {

        validateUser( userId, password );

      }

      $(".np-ui-login-button").html(btnLogin);
      $(".np-ui-account-button").html(btnRegister);
      $(".np-ui-changepassword-button").addClass('ui-disabled');
      $(".np-ui-ticket-button").addClass('ui-disabled');
      //    $(".np-ui-facebook-button").addClass('ui-disabled');
      $(".np-li-manager").hide();
      $(".np-li-admin").hide();
      $(".np-show-when-loggedin").hide();
      if (isLoggedIn()) {

        $(".np-ui-login-button").html(btnLogout);
        $(".np-ui-account-button").html(btnAccount);
        $(".np-ui-changepassword-button").removeClass('ui-disabled');
        $(".np-ui-ticket-button").removeClass('ui-disabled');
        $(".np-ui-facebook-button").removeClass('ui-disabled');
	      $(".np-show-when-loggedin").show();

        if (role == 'MANAGER' || role == 'ADMIN')
        {
          $(".np-li-manager").show();
        }

        if (role == 'ADMIN')
        {
          $(".np-li-admin").show();
        }

      }

    }
  );


