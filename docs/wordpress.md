# Wordpress

## How To Use

- Add this repo into the WordPress plugin directory
- Activate plugin `Plugins -> Use Audio -> Activate`
- Insert the shortcode `[getMicrophone]` onto any page
- Use the `Microphone` namepsace class


## Shortcode

```js
[getMicrophone]

```


## Shortcode Attributes

```js
controls="show" //Shows the default controls for controlling the microphone
id="" //Sets the container id attribute so it can be styled
```

##  Wordpress Example

```html
[getMicrophone controls="show"]

<script>
    if(Microphone){
        var mic = new Microphone()
        jQuery(document).ready(() => {
            jQuery('#start_microphone').click(() => {
                mic.getStream().then((payload) => {
                    mic.mute() //Unmute signal
                    var {context, node} = payload;

                    //Do things with the context and output node.
                })
            })

            jQuery('#stop_microphone').click(() => {
                mic.stop()
            })


            jQuery('#mute_microphone').click(() => {
                mic.mute()
            })
        })
    }
    else{
        alert('Microphone library was not loaded')
    }
</script>
```