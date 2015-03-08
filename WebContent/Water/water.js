(function($) {

	var water_update_delay = 50; // ms pr update	

	var methods = {
		init: function(options) {
			var defaults = {
				bottle3max: 3,
				bottle5max: 5,
			}; //default options
			var options = $.extend(defaults, options);
			return $(this).each(function() {
				with({$this:$(this)}) {
					$this.data('options', options); // Remember the initial options.
					$this.bind('touchmove', false);
					
					$this.data("bottle3current", 0);
					$this.data("bottle5current", 0);
					
					$this.water("gameover");
					
					$this.find(".reset").live('click', function() {
						$this.water("gameover");
					});
					
					$this.find(".startButton").live('click', function() {
						console.log("start game");
						$this.water("start");
					});
					
					//action for the bottles
					$this.find(".fill-bottle3").live('click', function() {
						$this.water("alterWater",3,true);
					});
					$this.find(".fill-bottle5").live('click', function() {
						$this.water("alterWater",5,true);
					});
					$this.find(".empty-bottle3").live('click', function() {
						$this.water("alterWater",3,false);
					});
					$this.find(".empty-bottle5").live('click', function() {
						$this.water("alterWater",5,false);
					});
					$this.find(".transfer-3to5").live('click', function() {
						$this.water("transfer",35);
					});
					$this.find(".transfer-5to3").live('click', function() {
						$this.water("transfer",53);
					});
					
					
				}
			}).water("updateWater");
		},
		
		alterWater: function(bottle,action) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					if(action === true){
						// fills a bottle
						if(bottle === 3){
							console.log("fill bottle3");
							$this.data("bottle3current",$this.data("options").bottle3max);
							$this.water("animateWater",3,true);
						} else if (bottle === 5){
							console.log("fill bottle5");
							$this.data("bottle5current",$this.data("options").bottle5max);
							$this.water("animateWater",5,true);
						}
					} else{
						// empties a bottle
						if(bottle === 3){
							console.log("empty bottle3");
							$this.data("bottle3current",0);
							$this.water("animateWater",3,false);
						} else if (bottle === 5){
							console.log("empty bottle3");
							$this.data("bottle5current",0);
							$this.water("animateWater",5,false);
						}
					}
					$this.data('actions', $this.data("actions")+1);
					$this.water("updateWater");
						
				}
			});
		},
		
		transfer: function(direction) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					if(direction === 35){
						//transfer water from bottle3 to bottle5
					
						var remaining5 = $this.data("bottle5current") + $this.data("bottle3current");
						
						if(remaining5 > $this.data("options").bottle5max){
							$this.data("bottle5current",$this.data("options").bottle5max);
							$this.data("bottle3current",remaining5 - $this.data("options").bottle5max);
						} else {
							$this.data("bottle5current",remaining5);
							$this.data("bottle3current",0);
						}
						$this.water("animateWater",35);
						console.log("Transfered water from bottle3 to bottle5");
						
					} else if (direction === 53){
						//transfer water from bottle5 to bottle3
						
						var remaining3 = $this.data("bottle5current") + $this.data("bottle3current");
						
						if(remaining3 > $this.data("options").bottle3max){
							$this.data("bottle3current",$this.data("options").bottle3max);
							$this.data("bottle5current",remaining3 - $this.data("options").bottle3max);
						} else {
							$this.data("bottle3current",remaining3);
							$this.data("bottle5current",0);
						}
						$this.water("animateWater",53);
						console.log("Transfered water from bottle5 to bottle 3");
					}
					$this.data('actions', $this.data("actions")+1);
					$this.water("updateWater");
				}
			});
		},
			
		animateWater: function(direction,fill) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					$this.find(".button").prop("disabled", true);
					console.log("animate water started");
					
					var flow = 10; // have to go up in 50,100,150,200,250
					var w3 = $this.find(".water3"); 
					var w5 = $this.find(".water5");
					var targetW3 = $this.data("bottle3current")*50;
					var targetW5 = $this.data("bottle5current")*50;
					var startW3 = w3.height();
					var startW5 = w5.height();
					var done = false;
					
					var inter = setInterval(function(){
				
						if(direction === 53){
							
							if(w3.height() === targetW3 && w5.height() === targetW5){
								done = true;
							}else if(w3.height() === targetW3){
								w5.css("height",w5.height()-flow);
							}else if(w5.height() === targetW5){
								w3.css("height",w3.height()+flow);
							}else{
								w3.css("height",w3.height()+flow);
								w5.css("height",w5.height()-flow);
							}
								
						} else if(direction === 35) {
							
							if(w3.height() === targetW3 && w5.height() === targetW5){
								done = true;
							}else if(w3.height() === targetW3){
								w5.css("height",w5.height()+flow);
							}else if(w5.height() === targetW5){
								w3.css("height",w3.height()-flow);
							}else{
								w3.css("height",w3.height()-flow);
								w5.css("height",w5.height()+flow);
							}
						} else if(direction === 3 && fill){
							if(w3.height() !== targetW3){
								w3.css("height",w3.height()+flow);
							}else{
								done = true;
							}
						} else if(direction === 3 && !fill){
							if(w3.height() !== targetW3){
								w3.css("height",w3.height()-flow);
							}else{
								done = true;
							}
						} else if(direction === 5 && fill){
							if(w5.height() !== targetW5){
								w5.css("height",w5.height()+flow);
							}else{
								done = true;
							}
						} else if(direction === 5 && !fill){
							if(w5.height() !== targetW5){
								w5.css("height",w5.height()-flow);
							}else{
								done = true;
							}
						}
						
						if (done){
							console.log("animate water ended");
							$this.find(".button").prop("disabled", false);
							$this.water("checkWinCondition");
							clearInterval(inter);
						}
					}, water_update_delay);
				};
			});
		},
		
		updateWater: function(direction) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					//Updates water
					//$this.find(".water3").css("height",$this.data("bottle3current")*50);
					/*$this.find(".bottle3-content").text($this.data("bottle3current"));
					console.log("updated bottle3 to " + $this.data("bottle3current"));*/
					
					//$this.find(".water5").css("height",$this.data("bottle5current")*50);
					/*$this.find(".bottle5-content").text($this.data("bottle5current"));
					console.log("updated bottle5 to " + $this.data("bottle5current"));*/
					
					console.log("water updated");
					
					//updates hid
					var $hid = $this.find(".hid");
					if($this.data("actions") > 6) {
						$hid.addClass("bad");
					} else {
						$hid.removeClass("bad");
					}
					
					$hid.find(".hid-water-actions").text($this.data("actions"));
					
				}
			});
		},
		
		checkWinCondition: function() {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					if($this.data("bottle5current") === 4){
						$this.water("gameover",$this.data("actions"));
					}
					
				}
			});
		},
		
		gameover: function(actions) {
			return $(this).each(function() {
				with({$this:$(this)}) {
					$this.find(".text").hide();
					$this.find(".water-hint").hide();
					
					$this.find(".actions-label").text(actions);
					
					if(actions > 6) {
						$this.find(".text.wintext-1").show();
						$this.find(".water-hint").fadeIn('slow');
					} else if( actions <= 6 && actions != 0 ) {
						$this.find(".text.wintext-1").show();
					} else {
						$this.find(".text.starttext").show();
					}
					
					$this.find(".modal-shadow").fadeIn();
				}
			});
		},
		
		start: function() {
			return $(this).each(function() {
				with({$this:$(this)}) {
					
					$this.find(".modal-shadow").fadeOut();
					$this.data("actions", 0);
					$this.data("bottle3current",0);
					$this.data("bottle5current",0);
					$this.find(".bottle3-content").text(0);
					$this.find(".bottle5-content").text(0);
					$this.find(".hid-water-actions").text(0);
					$this.find(".water3").css("height",0);
					$this.find(".water5").css("height",0);
				}
			}).water("updateWater");
		},
	};
	
	$.fn.water = function(method) {
		
		if(methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === "object" || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error("Method " +  method + " does not exist on jQuery.water" );
		}   
	};
	
})(jQuery);
