# Potato Landing Page Challenge


## Build

Requires [lovell/sharp](https://github.com/lovell/sharp): 

`brew install homebrew/science/vips` 

Run `npm install`.

## Gulp tasks

* `gulp` compiles .less, .js, compresses .jpg and .png to `dist/`
* `gulp less` compiles less
* `gulp png`  crushes pngs (except appicon)
* `gulp mozjpeg` compresses jpgs with mozjpeg

**note:** all custom pre-optimized images with suffix `-o` will be copied to `dist/`

---

# Design and Considerations

* some backgrounds have CSS radial gradients with a special noise layer over them
* the noise pattern is very subtle and is better seen at the darkest areas
* transformation slider works! and has custom drag css only button (no pngs)
* transparent pngs were used
* low-res transparent pngs were used with blur filter for size optimization instead of full-res blurred image.
* there was some knockout work to mix the images with the background gradients and background noise pattern. 
* top navbar has linear gradient background and is responsive but behavior is unfinished
* potato-sack blurred images are responsive (opacity and position)

---

# Future improvements
* use SASS instead of LESS
* remove bootstrap dependencies (use another grid)
* anchor points on "Healthy" section can be full css
* css transitions and animations
* better png patterns optimization (256px to 64px)
* responsive menu
* ...

by: Vasco Rola