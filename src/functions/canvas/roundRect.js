/**
 * @param  {CanvasRenderingContext2D} context
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} width
 * @param  {Number} height
 * @param  {(Number|Object)} radius
 * @param  {String} fill
 * @param  {Boolean} stroke
 */
const roundRect = (context, x, y, width, height, radius, fill, stroke) => {
    if (typeof radius === 'number') {
        radius = {
            'top-left': radius,
            'top-right': radius,
            'bottom-left': radius,
            'bottom-right': radius
        };
    } else {
        const defaultRadius = {
            'top-left': 0,
            'top-right': 0,
            'bottom-left': 0,
            'bottom-right': 0
        };
        for (const side in defaultRadius)
            radius[side] = radius[side] || defaultRadius[side];
    }
    context.beginPath();
    context.moveTo(x + radius['top-left'], y);
    context.lineTo(x + width - radius['top-right'], y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius['top-right']);
    context.lineTo(x + width, y + height - radius['bottom-right']);
    context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius['bottom-right'],
        y + height
    );
    context.lineTo(x + radius['bottom-left'], y + height);
    context.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius['bottom-left']
    );
    context.lineTo(x, y + radius['top-left']);
    context.quadraticCurveTo(x, y, x + radius['top-left'], y);
    context.closePath();
    if (fill) {
        context.fillStyle = 'rgba(54, 57, 63, 0)';
        context.fill();
    }
    if (stroke) context.stroke();
};

export { roundRect };
