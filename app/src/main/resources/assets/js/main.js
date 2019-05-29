function initLoginRegisterForm(){function a(){$("body div.modal").each(function(){$(this).removeClass("show")})}$(".js_header-user .guest-btn").on("click",function(e){showLogin(e)}),$(document).on("click",function(e){a()}),$(document).keyup(function(e){"Escape"===e.key&&a()}),$(".modal-action-register").on("click",function(e){e.preventDefault(),a(),$(".modal-registration").addClass("show")}),$(".modal-action-login").on("click",function(e){e.preventDefault(),a(),$(".modal-login").addClass("show")}),$(".modal-action-forgotpass").on("click",function(e){e.preventDefault(),a(),$(".modal-forgot-password").addClass("show")}),$(".reset-form .modal-btn-reset").on("click",function(e){e.preventDefault();var t={email:$(".modal-forgot-password").find("input[name=email]").val(),action:"forgotpass"};$.ajax({url:userServiceUrl,method:"POST",data:t}).done(function(e){console.log(e)})}),$(".login-form .modal-btn-login").on("click",function(e){e.preventDefault();var t={username:$(".modal-login").find("input[name=username]").val(),password:$(".modal-login").find("input[name=password]").val(),action:"login"};$.ajax({url:userServiceUrl,method:"POST",data:t}).done(function(e){e.exist||e.html?($(".js_header-user-wrap").html(e.html),a(),$(".modal-login .form-group-error").addClass("hidden")):($(".modal-login .form-group-error span").text(e.message),$(".modal-login .form-group-error").removeClass("hidden"))})}),$(".modal-content").on("click",function(e){e.stopPropagation()}),$(".register-form .modal-btn-register").on("click",function(e){e.preventDefault();var t={username:$(".modal-registration").find("input[name=username]").val(),password:$(".modal-registration").find("input[name=password]").val(),email:$(".modal-registration").find("input[name=email]").val(),action:"register"};if(!validateEmail(t.email))return $(".modal-registration .form-group-error span").text("Неправильный емейл"),$(".modal-registration .form-group-error").removeClass("hidden"),!1;$(".modal-registration .form-group-error").addClass("hidden");$.ajax({url:userServiceUrl,method:"POST",data:t}).done(function(e){e.exist?($(".modal-registration .form-group-error span").text(e.message),$(".modal-registration .form-group-error").removeClass("hidden")):(a(),$(".modal-registration .form-group-error").addClass("hidden"))})}),$(".resetPassForm").on("submit",function(e){$(".resetPassInput").val()!=$(".resetPassInputConfirm").val()&&(e.preventDefault(),$(".forgotPassValidation").removeClass("hidden"))})}function initPDPFunctions(){$(".qty-decrement").on("click",function(){var e=".qty-input[data-id="+$(this).data().id+"]";$(this).data().size&&(e+="[data-size="+$(this).data().size+"]");var t=$(e);t.val(Math.max(parseInt(t.val())-1,1)),0<$(".cart-list").length&&addToCartOnclick(t)}),$(".qty-input").on("change",function(){var e=$(this);(isNaN(parseInt(e.val()))||parseInt(e.val())<1)&&e.val("1"),e.val(Math.max(parseInt(e.val()),1)),0<$(".cart-list").length&&addToCartOnclick(e)}),$(".qty-increment").on("click",function(){var e=".qty-input[data-id="+$(this).data().id+"]";$(this).data().size&&(e+="[data-size="+$(this).data().size+"]");var t=$(e);t.val(Math.max(parseInt(t.val())+1,1)),0<$(".cart-list").length&&addToCartOnclick(t)}),$(".add_to_cart-btn").on("click",function(e){e.preventDefault(),$("#pdp-size-select").length&&!$("#pdp-size-select").val()?$("#pdp-size-select").addClass("is-invalid"):($("#pdp-size-select").removeClass("is-invalid"),addToCart())}),$("#pdp-size-select").on("change",function(){$(".pdp-validation").addClass("hidden"),$("#pdp-size-select").removeClass("is-invalid")})}function initHeaderClasses(){$(document).on("scroll",function(){85<$(document).scrollTop()?($(".header").addClass("change-logo"),($("body").hasClass("homepage")||$("body").hasClass("article-page")||$("body").hasClass("announce-page"))&&$(".header").addClass("header-scroll")):$(".header").removeClass("header-scroll change-logo")})}function addToCartOnclick(e){addToCart({itemId:e.data().id,size:e.data().size,amount:e.val(),cartId:getCookieValue("cartId"),action:"modify",force:!0})}function initCheckoutEvents(){$(".checkout-action .checkout-continue").on("click",function(e){validateCheckout(e)}),$("form.checkout-form").on("submit",function(e){validateCheckout(e)}),$("#phone-checkout-input").on("change paste keyup",function(){$("#phone-checkout-input").val($("#phone-checkout-input").val().replace(/\D+/g,""))}),$(".checkout-form input, .checkout-form select").on("change",function(){""!=$(this).val()&&$(this).parent().removeClass("is-invalid")}),$(".delivery_np-input-city").on("input",function(){if(1<$(this).val().length){var e={apiKey:"8913262e83513c669457b8c48224f3ab",modelName:"Address",calledMethod:"searchSettlements",methodProperties:{Limit:"10"}};e.methodProperties.CityName=$(".delivery_np-input-city").val(),$.ajax({url:"https://api.novaposhta.ua/v2.0/json/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(e){$("#suggestion-list").html("");for(var t=e.data[0].Addresses,a=0;a<t.length;a++)$("#suggestion-list").append("<li data-ref='"+t[a].DeliveryCity+"'>"+t[a].MainDescription+"</li>")}})}}),$("#suggestion-list").on("click","li",function(){$(".delivery_np-input-city").val($(this).text()),$(".delivery_np-input-city").data("ref",$(this).data("ref")),$("#suggestion-list").html("");var e={apiKey:"8913262e83513c669457b8c48224f3ab",modelName:"AddressGeneral",calledMethod:"getWarehouses",methodProperties:{Language:"ru",Limit:"99999",CityRef:$(this).data("ref")}};$.ajax({url:"https://api.novaposhta.ua/v2.0/json/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(e){$("#delivery_np-warehouses").html('<option disabled="disabled" selected="selected">Выберите отделение</option>');for(var t=0;t<e.data.length;t++)$("#delivery_np-warehouses").append('<option value="'+e.data[t].DescriptionRu+'">'+e.data[t].DescriptionRu+"</option>")}})}),$("#delivery_np-warehouses").on("change",function(){var e={apiKey:"8913262e83513c669457b8c48224f3ab",modelName:"InternetDocument",calledMethod:"getDocumentPrice",methodProperties:{CitySender:"e221d627-391c-11dd-90d9-001a92567626",CityRecipient:$(".delivery_np-input-city").data("ref"),Weight:$("#cartWeight").val(),ServiceType:"WarehouseWarehouse",Cost:"100",CargoType:"Parcel",SeatsAmount:"1"}};$.ajax({url:"https://api.novaposhta.ua/v2.0/json/",type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(e){$(".delivery_m-subtitle").text("UAH "+e.data[0].Cost)}})})}function initSharedEvents(){$(".js_like-article").on("click",function(e){e.preventDefault(),checkUserLoggedIn()?doUpvote(this):showLogin(e)}),$("a.social-link.facebook").on("click",function(e){return window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(window.location.href),"facebook-share-dialog","width=626,height=436"),!1}),$(window).width()<768&&$(".mobile_menu").on("click",function(){$(this).toggleClass("open"),$(".header").toggleClass("open")}),0<$("form[name=payment]").length&&$("form[name=payment]").submit(),setCookie(cartId),0<$("#payment-success").length&&deleteCookie("cartId"),$(".js_bookmarks").on("click",function(e){if(checkUserLoggedIn()){var t=$(this);$.ajax({url:"/_/service/com.myurchenko.kostirpg/user",type:"POST",async:!0,data:{id:$(this).data().contentid,action:"addBookmark"},success:function(e){!0===e?(t.addClass("active"),isEmpty(t)||t.text("В ЗАКЛАДКАХ")):(t.removeClass("active"),isEmpty(t)||t.text("В ЗАКЛАДКИ"))}})}else showLogin(e)}),0<$(".blog-list").length&&$(document).on("scroll",function(){$(document).scrollTop()+$(window).height()+150>$(document).height()&&($(".blog-list").data("noMoreArticles")||loadMoreArticles())}),$(document).on("scroll",function(){1200<$(document).scrollTop()?$(".js_back_to_top").removeClass("hidden"):$(".js_back_to_top").addClass("hidden")}),$(".js_back_to_top").on("click",function(){return $("html,body").animate({scrollTop:0},"slow"),$(".js_back_to_top").addClass("hidden"),!1})}function loadMoreArticles(){var t=$(".blog-list").data("page");t||(t=0);$(".blog-list").data("feedType");$(".js_lazyload-icon").removeClass("hidden"),$.ajax({url:contentServiceUrl,type:"GET",async:!1,data:{feedType:$(".js_blog-navigation .active").data("type"),page:t,userId:$(".js_user-page-id").data("userid")},success:function(e){""==e?($(".blog-list").append("<div class='blog-list-empty'>Статей больше нет.</div>"),$(".blog-list").data("noMoreArticles",!0)):$(".blog-list").append(e),$(".js_lazyload-icon").addClass("hidden"),$(".blog-list").data("page",t+1)}})}function initCartFunctions(){$(".js_cart-remove_btn").on("click",function(){addToCart({itemId:$(this).data().id,size:$(this).data().size,amount:0,cartId:$("#ordersAdminCartID").length?$("#ordersAdminCartID").val():getCookieValue("cartId"),action:"modify",force:!0});$(this).closest(".cart-item").remove()})}function initFormEvents(){$("input[type=checkbox]").on("click",function(e){var t=this;if(!checkSpace(this))return e.preventDefault(),void $(this).attr("disabled",!0);$(this).parent().parent().find("input[type=checkbox]:checked").each(function(){this!=t&&$(this).prop("checked",!1)})}),$("main.form input[type=submit]").on("click",function(e){var t=legendary?2:1;$("main.form [type=checkbox]:checked").length>t?(e.preventDefault(),$("form .invalid-qauntity").removeClass("hidden")):$("form .invalid-qauntity").addClass("hidden"),$("input[type=checkbox]:checked").each(function(){checkSpace(this)?$("form .invalid-space").addClass("hidden"):($("form .invalid-space").removeClass("hidden"),e.preventDefault())}),$("main.form input[type=text]").each(function(){""==$(this).val()?(e.preventDefault(),$(this).addClass("is-invalid"),$("form .invalid-input").removeClass("hidden")):($(this).removeClass("is-invalid"),$("form .invalid-input").addClass("hidden"))})}),$("input[type=checkbox]").each(function(){checkSpace(this)||$(this).attr("disabled",!0)})}function initUserPageEvents(){$(".js_profile-settings").on("click",function(e){e.preventDefault(),e.stopPropagation(),$(".modal-edit_user").addClass("show")}),$(".js_edit_user-form").on("submit",function(e){e.preventDefault();var t={};$.each($(this).serializeArray(),function(){t[this.name]=this.value}),editUserData(t)})}function editUserData(e){makeAjaxCall(userServiceUrl,"POST",e,!0).done(function(e){$(".modal-edit_user").removeClass("show")})}function checkSpace(e){var t,a={action:"checkspace",name:$(e).val(),game:$(e).attr("name")};return $.ajax({url:"/_/service/com.myurchenko.kostirpg/form",type:"POST",async:!1,data:a,success:function(e){t=!(e.space>=space[a.game][a.name])}}),t}function doUpvote(e){var t={content:$(e).data("contentid")},a=e;$.ajax({type:"POST",url:contentServiceUrl,data:t,success:function(e){var t="0";e.votes&&(t=Array.isArray(e.votes)?e.votes.length:"1"),parseInt($(a).text().trim())<t?$(a).addClass("active"):$(a).removeClass("active"),$(a).html("<span>"+t+"</span>")},error:function(e){console.log("error"),console.log(e)}})}function addToCart(e){(e=e)||(e={action:"modify",cartId:getCookieValue("cartId"),itemId:$("input[name=productId]").val(),amount:$("input[name=quantity]").val(),size:$("select[name=itemSize]").val()}),$(".minicart .minicart-qty").removeClass("animate"),$.ajax({url:cartServiceUrl,type:"POST",data:e,success:function(e){setCookie(e._id),$(".minicart .minicart-total").html("UAH "+e.price.items),$(".minicart .minicart-qty").text(99<parseInt(e.itemsNum)?"9+":e.itemsNum),$(".cart-total .value .cart-items-price").text(e.price.items),$(".minicart .minicart-qty").addClass("animate"),e.stock?$(".checkout-action .checkout-continue").removeClass("not-active"):$(".checkout-action .checkout-continue").addClass("not-active");for(var t=0;t<e.items.length;t++){var a=".cart-product_price-wrap[data-id="+e.items[t]._id+"]";e.items[t].itemSize&&(a+="[data-size="+e.items[t].itemSize+"]"),e.items[t].stock&&e.items[t].itemSizeStock?($(a).find(".productPrice").removeClass("hidden"),$(a).find(".productOutOfStock").addClass("hidden")):($(a).find(".productPrice").addClass("hidden"),$(a).find(".productOutOfStock").removeClass("hidden"))}}})}function validateCheckout(e){$("form.checkout-form input, form.checkout-form select").each(function(){null!=$(this).val()&&""!=$(this).val()||(e.preventDefault(),$(this).parent().addClass("is-invalid"))});var t=$("#phone-checkout-input").val();t&&!validatePhone(t)&&(e.preventDefault(),$("#phone-checkout-input").parent().addClass("is-invalid"));var a=$("#email-checkout-input").val();a&&!validateEmail(a)&&(e.preventDefault(),$("#email-checkout-input").parent().addClass("is-invalid")),$("#agreement").length&&!$("#agreement").is(":checked")&&(e.preventDefault(),$("#agreement").parent().addClass("is-invalid")),!$("#delivery_np-warehouses").length||$("#delivery_np-warehouses").val()&&""!=$("#delivery_np-warehouses").val()||(e.preventDefault(),$("#delivery_np-warehouses").addClass("is-invalid")),!$("#delivery_np-input-city").length||$("#delivery_np-input-city").val()&&""!=$("#delivery_np-input-city").val()||(e.preventDefault(),$("#delivery_np-input-city").parent().addClass("is-invalid"))}$(document).ready(function(){initLoginRegisterForm(),initCheckoutEvents(),initCartFunctions(),initSharedEvents(),initHeaderClasses(),initPDPFunctions(),initUserPageEvents(),0<$("main.form").length&&initFormEvents()});