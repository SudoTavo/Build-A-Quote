
var quoteData = [];
var costTable = [];
var quoteID = 0;
var email = "none";
var productImage;
var productDesc;
var total;
var rawSum;
var quoteOverview = "<table><tr><td style='text-align:center;'><p>Loading overview...<p></td></tr></table>";
var overview = "";
var isMobile = false; //initiate as false
var appendProduct = true;
var quoteGen = false;
var selfie;
var updateOverview = true;
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
var is_keyboard = false;
var is_landscape = false;
var initial_screen_size = window.innerHeight;
jQuery(document).ready(function ($) {
    function ProductBuilder(element) {
        this.element = element;
        this.stepsWrapper = this.element.children('.cd-builder-steps');
        this.steps = this.element.find('.builder-step');
        //store some specific bulider steps
        this.models = this.element.find('[data-selection="models"]');
        this.modelsList = this.element.find('models-list');
        this.summary;
        this.percentAdd = 0.00;
        this.rawCost = 0;
        this.serviceCost = 0;
        this.optionsLists = this.element.find('.options-list');
        //bottom summary 
        this.fixedSummary = this.element.find('.cd-builder-footer');
        this.modelPreview = this.element.find('.selected-product').find('img');
        this.totPriceWrapper = this.element.find('.tot-price').find('b');
        this.emailForm = this.element.find('.emailform');
        //builder navigations
        this.mainNavigation = this.element.find('.cd-builder-main-nav');
        this.secondaryNavigation = this.element.find('.cd-builder-secondary-nav');
        //used to check if the builder content has been loaded properly
        this.loaded = true;
        this.hasExtra = false;
        this.extraCost = Number(0);
        this.extraDesc = "Extra cost";
        
        //Check if we need to append a product to an existing quote
        var quoteParam = getUrlVars()["quoteid"];
        if (quoteParam !== undefined){
            appendProduct = true;
            quoteID = quoteParam;
            history.pushState(null, "", location.href.split("?")[0]);
        }
        
        else{
            appendProduct = false;

        }
        
        // bind builder events
        this.bindEvents();

        this.getProductsContent();
        
        
    }

    ProductBuilder.prototype.bindEvents = function () {
        var self = this;

        //detect click on the left navigation
        this.mainNavigation.on('click', 'li:not(.active)', function (event) {
            event.preventDefault();
            self.loaded && self.newContentSelected($(this).index());
        });

        //detect click on bottom fixed navigation
        this.secondaryNavigation.on('click', '.nav-item li:not(.quote)', function (event) {
            event.preventDefault();
            var stepNumber = ($(this).parents('.next').length > 0) ? $(this).index() + 1 : $(this).index() - 1;
            self.loaded && self.newContentSelected(stepNumber);
        });
        this.secondaryNavigation.on('click', '.nav-item li.quote', function (event) {
            event.preventDefault();
            selfie = self;
            email = "none";
            
            updateOverview = false;            
            getQuote();
        });

        this.stepsWrapper.on('focus', 'textarea', function(event){
           
            if(isMobile){
                self.fixedSummary.add(self.mainNavigation).addClass('disabled');
            }
                
     });
             this.stepsWrapper.on('blur', 'textarea', function(event){
           
            if(isMobile){
               self.fixedSummary.add(self.mainNavigation).removeClass('disabled');
            }
                
     });
        //Email button
        this.stepsWrapper.on('submit', '.emailform', function(event) {
            event.preventDefault();
            $(this).find('.emailbutton').val("Sending email...")
             email = $(this).find('.email').val();
             selfie = self;
             
             updateOverview = false;
             
           getQuote();
           
            return false;     
        });
        
        //Add another product to this quote
        this.stepsWrapper.on('submit', '.addProduct', function(event) {
            event.preventDefault();
            
            if(!appendProduct && !quoteGen){
                selfie = self;
                
                storeProduct(overview);
            }
            
            window.onbeforeunload = function () {
                // blank function do nothing
            };
          
            //window.location.search = jQuery.query.set("quoteid", quoteID);
           // unloadMessage = "Append another product to this quote? Choosing \"yes\" will redirect you to the product selection page.";
            window.location.search = '?quoteid='+quoteID;
            
            // unloadMessage = "Data will be lost if you leave the page, are you sure?";
             //alert("Looks like you're trying to add a product. I can't do that yet. Teach me?");
            // location.reload();
            // email = $(this).find('.email').val();
           //getQuote();
       
            return false;     
        });
        
        this.stepsWrapper.on('change input', '.extra .desc', function (event) {

            if ($(this).val())
            {
                self.extraDesc = $(this).val();
            }
  

        });
        this.stepsWrapper.on('change input', '.extra .cost', function (event) {

            if ($(this).val())
            {

                self.hasExtra = true;

                if ($(this).val() < 0) {

                    self.extraCost = Number(($(this).val()));
                } else {
                    self.extraCost = Number($(this).val());
                }
                self.updatePrice(0);


            } else
            {
                self.hasExtra = false;
                self.extraCost = Number(0);
                self.updatePrice(0);
            }
 

        });
        //detect click on an option catgory
        this.stepsWrapper.on('click', '.category', function (event) {
            if (!($(this).hasClass('extra') && $(this).hasClass('unhide'))) {
                $(this).toggleClass('unhide');
            }

        });

        //detect click on one element in an options list (e.g, models, accessories)
        this.optionsLists.on('click', '.js-option', function (event) {
            self.updateListOptions($(this));
        });
        //detect clicks on customizer controls (e.g., colors ...)
        this.stepsWrapper.on('click', '.cd-product-customizer a', function (event) {
            event.preventDefault();
            self.customizeModel($(this));
        });
        this.stepsWrapper.on('click', '.button', function (event) {
            updateOverview = false;
            getQuote();
        });
    };

    ProductBuilder.prototype.newContentSelected = function (nextStep) {
        //first - check if a model has been selected - user can navigate through the builder


        if (this.fixedSummary.hasClass('disabled')) {
            //no model has been selected - show alert
            this.fixedSummary.addClass('show-alert');
        } else {
            //model has been selected so show new content 
            //first check if the color step has been completed - in this case update the product bottom preview
            /*if( this.steps.filter('.active').is('[data-selection="colors"]') ) {
             //in this case, color has been changed - update the preview image
             var imageSelected = this.steps.filter('.active').find('.cd-product-previews').children('.selected').children('img').attr('src');
             this.modelPreview.attr('src', imageSelected);
             }*/
            //if Summary is the selected step (new step to be revealed) -> update summary content
            if (nextStep + 1 >= this.steps.length) {
                this.createSummary();
            }

            this.showNewContent(nextStep);
            this.updatePrimaryNav(nextStep);
            this.updateSecondaryNav(nextStep);
        }
    };

    ProductBuilder.prototype.showNewContent = function (nextStep) {
        var actualStep = this.steps.filter('.active').index() + 1;
        if (actualStep < nextStep + 1) {
            //go to next section
            this.steps.eq(actualStep - 1).removeClass('active back').addClass('move-left');
            this.steps.eq(nextStep).addClass('active').removeClass('move-left back');
            if (actualStep == 1) {
                this.fixedSummary.addClass('disabled');
            }
        } else {
            //go to previous section
            this.steps.eq(actualStep - 1).removeClass('active back move-left');
            this.steps.eq(nextStep).addClass('active back').removeClass('move-left');
        }
    };

    ProductBuilder.prototype.updatePrimaryNav = function (nextStep) {
        this.mainNavigation.find('li').eq(nextStep).addClass('active').siblings('.active').removeClass('active');
    };

    ProductBuilder.prototype.updateSecondaryNav = function (nextStep) {
        (nextStep == 0) ? this.fixedSummary.addClass('step-1') : this.fixedSummary.removeClass('step-1');

        this.secondaryNavigation.find('.nav-item.next').find('li').eq(nextStep).addClass('visible').removeClass('visited').prevAll().removeClass('visited').addClass('visited').end().nextAll().removeClass('visible visited');
        this.secondaryNavigation.find('.nav-item.prev').find('li').eq(nextStep).addClass('visible').removeClass('visited').prevAll().removeClass('visited').addClass('visited').end().nextAll().removeClass('visible visited');
    };

    ProductBuilder.prototype.createSummary = function () {
        var self = this;
        getQuoteID ();
       quoteData = [];
       costTable = [];
        this.steps.each(function () {
            //this function may need to be updated according to your builder steps and summary
            var step = $(this);
           
            if ($(this).data('selection') == 'accessories') {
                var selectedOptions = $(this).find('.js-option.selected'),
                        optionsContent = '<table> <tr><th>Options</th><th>Price</th> </tr>',
                        overviewTable = '<table> <tr><th colspan="2" ><p>Product: </p>' + productDesc + '</th></tr>';

                if (selectedOptions.length == 0) {
                    optionsContent = '<table><tr><th> No Accessories selected.</th></tr></table>';
                    overviewTable = '<table><tr><th>1 unit in quote.</th></tr></table>';
                } else {
                    //   optionsContent+= '<tr><td><p>' + $(this).find('p').text() + '</p></td><td><p> ' + ' ' + ' </p></td></tr>';
                    selectedOptions.each(function () {
                        newOption = {};
                        newOption['category'] = $(this).parent().find('h1').text().replace(' (Required)','');
                        newOption['option'] = $(this).find('p').text();
                        newOption['priceNum'] = $(this).data('price');

                        var formatedPrice = $(this).find('span').text();

                        if ($(this).hasClass('percent')) {
                            formatedPrice = $(this).data('price') * self.rawCost;
                            formatedPrice = roundToTwo(formatedPrice).toFixed(2);
                            formatedPrice = '$' + formatedPrice;
                        }

                        newOption['price'] = formatedPrice;
                        optionsContent += '<tr><td><p>' + $(this).find('p').text() + '</p></td><td><p> ' + formatedPrice + ' </p></td></tr>';
                        overviewTable += '<tr><td colspan="1"><p>' + $(this).find('p').text() + '</p></td><td></td></tr>';
                        quoteData.push(JSON.stringify(newOption));
                    });
                    if (self.hasExtra) {

                        newOption = {};
                        newOption['category'] = "Extra cost/discount";
                        newOption['option'] = self.extraDesc;
                        newOption['priceNum'] = self.extraCost;

                        var formatedPrice;
                        if (self.extraCost < 0) {
                            formatedPrice = '-$' + roundToTwo(Math.abs(self.extraCost)).toFixed(2);
                        } else {
                            formatedPrice = '$' + roundToTwo(self.extraCost).toFixed(2);
                        }
                        newOption['price'] = formatedPrice;
                        optionsContent += '<tr><td><p>' + self.extraDesc + '</p></td><td><p> ' + formatedPrice + ' </p></td></tr>';
                        overviewTable += '<tr><td colspan="2"><p>' + self.extraDesc + '</p></td></tr>';
                        
                        quoteData.push(JSON.stringify(newOption));

                    }


                    optionsContent += '<tr><td></td><td></td></tr><tr><th>Total:</th><th>$' + self.totPriceWrapper.text() + '</th></tr> </table>';
                    overviewTable += '<tr><th>Price:</th><th>$' + self.totPriceWrapper.text() + '</th></tr>'
                                      + "<tr><td></td><td></td></tr><tr><th>Grand Total:</th><th>$</th></tr> </table>";
                    
                    
                    total = self.totPriceWrapper.text();
                }
                productName = '<h3>' + self.element.find('.models-list').find('.selected').find('span.name').text() + '</h3>';
                costTable = JSON.stringify((productName + optionsContent));
                overview = overviewTable;
                self.summary.find('.summary-accessories.options').children('table').remove().end().append($(optionsContent));
                
                
                
                if(appendProduct){
                    selfie = self;
                    storeProduct(overviewTable);
                     self.summary.find('.summary-accessories.additional-products').children('table').remove().end().append($(quoteOverview));
                }
                var addProdButton = "<form class=\"addProduct\"> \n\
                    <input type=\"submit\" value=\"Add another item\"> </form>";
                
                self.summary.find('.summary-accessories.additional-products').children('form').remove().end();
                self.summary.find('.summary-accessories.additional-products').append($(addProdButton));
                
                
            }
        });
    };

    ProductBuilder.prototype.updateListOptions = function (listItem) {
        var self = this;

        if (listItem.hasClass('js-radio')) {


            //this means only one option can be selected (e.g., models) - so check if there's another option selected and deselect it
            var alreadySelectedOption = listItem.siblings('.selected'),
                    price = (alreadySelectedOption.length > 0) ? -Number(alreadySelectedOption.data('price')) : 0;

            //if the option was already selected and you are deselecting it - price is the price of the option just clicked
            (listItem.hasClass('selected'))
                    ? price = -Number(listItem.data('price'))
                    : price = Number(listItem.data('price')) + price;

            //now deselect all the other options
            alreadySelectedOption.removeClass('selected');
            //toggle the option just selected
            listItem.toggleClass('selected');

            //update totalPrice - only if the step is not the Models step
            if (!listItem.parent().hasClass('service')) {
                (listItem.parents('[data-selection="models"]').length == 0) && self.updatePrice(price);
            } else {
                (listItem.parents('[data-selection="models"]').length == 0) && self.updateServicePrice(price);
            }

            //    }
        } else {
            //more than one options can be selected - just need to add/remove the one just clicked
            var price = (listItem.hasClass('selected')) ? -Number(listItem.data('price')) : Number(listItem.data('price'));
            //toggle the option just selected
            listItem.toggleClass('selected');

            //update totalPrice

            //Check if its a service price
            if (listItem.parent().hasClass('service')) {
                self.updateServicePrice(price);
            } else {
                self.updatePrice(price);
            }
        }

        if (listItem.hasClass('selected')) {
            listItem.parent().children('p').text(listItem.find('p').text());
            listItem.parent().children('span').text("+" + listItem.find('span').text());
        } else {
            listItem.parent().children('p').text("None");
            listItem.parent().children('span').text("");
        }


        if (listItem.parents('[data-selection="models"]').length > 0) {
            //since a model has been selected/deselected, you need to update the builder content


            self.updateModelContent(listItem);

        }
        if (listItem.parents('[data-selection="accessories"]').length > 0) {
            //since a model has been selected/deselected, you need to update the builder content

            if (listItem.parents('[data-selection="accessories"]').find('.required > .selected').length == listItem.parents('[data-selection="accessories"]').find('.required').length) {

                self.fixedSummary.add(self.mainNavigation).removeClass('disabled show-alert');

            } else {
                self.fixedSummary.add(self.mainNavigation).addClass('disabled');
            }
            // });



        }
    };

    ProductBuilder.prototype.getProductsContent = function (){
        var self = this;     
           
        
        $.ajax({
                type: "GET",
                dataType: "html",
                url: "getProducts.php",
                beforeSend: function () {
                    self.loaded = false;                   
                },
                success: function (response) {
                   self.loaded = true;
                   self.models.find('.models-list').children('li').remove().end().append(response);
                   
                },
                error: function (jqXHR, textStatus, errorThrown) {
                   self.models.find('.models-list').children('li').remove().end().append("Error, could not get products");
                }
            });
        
    };
    
  
    
    
    ProductBuilder.prototype.updateModelContent = function (model) {
        var self = this;
        if (model.hasClass('selected')) {
            var modelType = model.data('model'),
                    modelImage = model.find('img').attr('src'),
                    modelDesc = model.find('span.name').text();
                    productImage = modelImage;
                    productDesc = modelDesc;
            //need to update the product image in the bottom fixed navigation
            this.modelPreview.attr('src', modelImage);

            //need to update the content of the builder according to the selected product
            //first - remove the contet which refers to a different model
            this.models.siblings('li').remove();
            //second - load the new content
            $.ajax({
                type: "GET",
                dataType: "html",
                url: "getOptions.php",
                data: {'product': modelType,'image':modelImage,'description':modelDesc},
                cache: false,
                beforeSend: function () {
                    self.loaded = false;
                    model.siblings().removeClass('loaded');
                    
                },
                success: function (data) {
                    self.models.after(data);
                    self.loaded = true;
                    model.addClass('loaded');
                    //activate top and bottom navigations
                    self.fixedSummary.add(self.mainNavigation).removeClass('disabled show-alert');
                    //update properties of the object
                    self.steps = self.element.find('.builder-step');
                    self.summary = self.element.find('[data-selection="summary"]');
                    //detect click on one element in an options list
                    self.optionsLists.off('click', '.js-option');
                    self.optionsLists = self.element.find('.options-list');
                    self.optionsLists.on('click', '.js-option', function (event) {
                        self.updateListOptions($(this));
                    });

                    //this is used not to load the animation the first time new content is loaded
                    self.element.find('.first-load').removeClass('first-load');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //you may want to show an error message here
                }
            });

            //update price (no adding/removing)
            model.data('price');
            this.totPriceWrapper.text(model.data('price'));
        } else {
            //no model has been selected
            this.fixedSummary.add(this.mainNavigation).addClass('disabled');
            //update price
            this.totPriceWrapper.text('0');

            this.models.find('.loaded').removeClass('loaded');
        }
    };

    ProductBuilder.prototype.customizeModel = function (target) {


        var parent = target.parent('li');
        index = parent.index();

        //update final price
        var price = (parent.hasClass('selected'))
                ? 0
                : Number(parent.data('price')) - parent.siblings('.selected').data('price');

        this.updatePrice(price);
        target.parent('li').addClass('selected').siblings().removeClass('selected').parents('.cd-product-customizer').siblings('.cd-product-previews').children('.selected').removeClass('selected').end().children('li').eq(index).addClass('selected');
    };

    ProductBuilder.prototype.updatePrice = function (price) {

        if ((price < 0) && (price > (-1))) {
            this.percentAdd += price;
            var actualPrice = this.rawCost + (this.rawCost * this.percentAdd) + this.serviceCost + this.extraCost;
            rawSum = actualPrice;
            this.totPriceWrapper.text(addCommas(roundToTwo(actualPrice).toFixed(2)));
        } else if ((price < 1) && (price > 0)) {
            this.percentAdd += price;
            var actualPrice = this.rawCost + (this.rawCost * this.percentAdd) + this.serviceCost + this.extraCost;
            rawSum = actualPrice;
            this.totPriceWrapper.text(addCommas(roundToTwo(actualPrice).toFixed(2)));
        } else {
            this.rawCost += price;
            var actualPrice = this.rawCost + (this.rawCost * this.percentAdd) + this.serviceCost + this.extraCost;
            rawSum = actualPrice;
            this.totPriceWrapper.text(addCommas(roundToTwo(actualPrice).toFixed(2)));
        }
    };
    ProductBuilder.prototype.updateServicePrice = function (price) {
        
        if ((price < 0) && (price > (-1))) {
            this.percentAdd += price;
            var actualPrice = this.rawCost + (this.rawCost * this.percentAdd) + this.serviceCost + this.extraCost;
            rawSum = actualPrice;
            this.totPriceWrapper.text(addCommas(roundToTwo(actualPrice).toFixed(2)));
        } else if ((price < 1) && (price > 0)) {
            this.percentAdd += price;
            var actualPrice = this.rawCost + (this.rawCost * this.percentAdd) + this.serviceCost + this.extraCost;
            rawSum = actualPrice;
            this.totPriceWrapper.text(addCommas(roundToTwo(actualPrice).toFixed(2)));
        }
        else{
        this.serviceCost += price;
        var actualPrice = this.rawCost + (this.rawCost * this.percentAdd) + this.serviceCost + this.extraCost;
        rawSum = actualPrice;
        this.totPriceWrapper.text(addCommas(roundToTwo(actualPrice).toFixed(2)));
        }
    };


    if ($('.cd-product-builder').length > 0) {
        $('.cd-product-builder').each(function () {
            //create a productBuilder object for each .cd-product-builder
            new ProductBuilder($(this));
        });
    }
    
window.onbeforeunload = function() {
  //  window.onbeforeunload();
  return "Data will be lost if you leave the page, are you sure?";
};



});

  function storeProduct (table){ 

        var price = rawSum;
        
        var request = $.ajax({
        url: "storeProduct.php",
        type: "POST",
        beforeSend: function () {
            
                },
        data: {'quoteData[]': quoteData, 'table': table, 'price': price, 'quoteID':quoteID,'description':productDesc},

        cache: false,
        success: function (response) {
            quoteOverview = response;
            
            if(updateOverview){
                selfie.summary.find('.summary-accessories.additional-products').children('table').remove().end().append($(quoteOverview));
            }
            else{
                updateOverview = true;
            }
        }
    });
    
    request.done(function (msg) {
        

    });

    
        
    };

function getQuote() {

if(!appendProduct){
    updateOverview = false;
    if(!quoteGen){
        quoteGen = true;
        storeProduct(overview);
    }

}


var newWin;
    if(email == "none"){    
        $('#quoteLoad')[0].style.display = "block";
            newWin = window.open('', '_blank');
            

    }
    else{
      //  alert("This quote will be sent to "+email+". \n Click OK to send.");
    }
        
    var comment = $('#textcomment').val();
    var request = $.ajax({
        url: "getQuote.php",
        type: "POST",
        data: {'quoteData[]': quoteData, 'costTable': costTable, 'quoteID':quoteID,
                 'comment': comment, 'email': email, 'image':productImage, 'description':productDesc,'total':rawSum},

        cache: false,
        success: function (response) {
            if(email == "none"){  
                $('#quoteLoad')[0].style.display = "none";
            }
            else{
                alert(response);
                selfie.stepsWrapper.find('.emailbutton').val("Email Quote");
            }
            
        }
    });

    request.done(function (msg) {

        var quoteurl = 'temp/' + quoteID + '/quote.pdf';
        if(email == "none"){  
            newWin.location = quoteurl;
        }
    });

    request.fail(function (jqXHR, textStatus) {
        $('#quoteLoad')[0].style.display = "none";
        alert("Request failed: " + textStatus);

    });

    request.always(function () {
        // Reenable the inputs

    });
    return false;
};

function getQuoteID (){
    if(!appendProduct){
        quoteID = parseInt((Date.now()).toString().slice(5,13));
    }
        
};

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
