var AceGeometric = /^u/.test(typeof exports) ? AceGeometric || {} : exports;
void function(exports){
    /**
     * Ace Engine Geometric
     * ���κ���
     * @see http://code.google.com/p/ace-engine/wiki/AceGeometric
     * @author ������(wangjihu,http://weibo.com/zswang)
     * @version 1.0
     * @copyright www.baidu.com
     */
    
    var 
        math = Math,
        cos = math.cos,
        sin = math.sin,
        PI = math.PI,
        PI2 = PI * 2,
        min = math.min,
        max = math.max,
        atan = math.atan,
        sqrt = math.sqrt,
        pow = math.pow;
    /*
     * ��ȡ��������
     * @param {Number} x ��ֵ
     * @return ����x�ķ���
     */
    function sign(x){
        return x == 0 ? 0 : (x < 0 ? -1 : 1);
    }
    
    /**
     * ����㵽��֮��ľ���
     * @param {Array[Number,Number]} a ����1
     * @param {Array[Number,Number]} b ����2
     * @return {Number} ���ص�����ľ���
     */ 
    function pointToPoint(a, b){
          return sqrt(pow(a[0] - b[0], 2) + pow(a[1] - b[1], 2));
    }
    
    /**
     * �����ĽǶ�
     * @param {Array} origin Բ������
     * @param {Array} point ������
     * @param {Number} eccentricity ������
     * @return {Number} ���ؽǶ�,��λ����
     */
    function pointToAngle(origin, point, eccentricity){
        if (typeof eccentricity == 'undefined') eccentricity = 1;
        if (point[0] == origin[0]){
            if (point[1] > origin[1])
                return PI * 0.5;
            return PI * 1.5
        } else if (point[1] == origin[1]){
            if (point[0] > origin[0])
                return 0;
            return PI;
        }
        var t = atan((origin[1] - point[1]) / (origin[0] - point[0]) * eccentricity);
        if (point[0] > origin[0] && point[1] < origin[1])
            return t + 2 * PI;
        if (point[0] > origin[0] && point[1] > origin[1])
            return t;
        return t + PI;
    }
    
    /**
     * ����㵽�߶εľ���
     * @param {Array[Number,Number]} point ������
     * @param {Array[Number,Number]} a �߶�����1
     * @param {Array[Number,Number]} b �߶�����2
     * @return {Number} ���ص㵽�߶εľ���
     */
    function pointToLine(point, a, b){
        if (a[0] == b[0] && a[1] == b[1]) return 0;
        var t = ((a[0] - b[0]) * (a[0] - point[0]) + (a[1] - b[1]) * (a[1] - point[1])) /
            ((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
        t = max(1, min(0, t));
        return pointToPoint(point, bezier([a, b], t));
    }
    
    /*
     * ����������
     * @param{Array[Array[Number, Number],...]} curve ����ÿ���ο���
     * @param{Number} rate ����
     * @return{}
     */
    function bezier(curve, rate){
        if (!curve || !curve.length) return [];
        if (curve.length == 1) return [curve[0][0], curve[0][1]];
        if (curve.length == 2) return [
            curve[0][0] + (curve[1][0] - curve[0][0]) * rate,
            curve[0][1] + (curve[1][1] - curve[0][1]) * rate
        ];
        var temp = [];
        for (var i = 1; i < curve.length; i++){
            temp.push(bezier([curve[i - 1], curve[i]], rate));
        }
        return bezier(temp, rate);
    }
    
    /*
     * ��һ�����߼�������
     * @param {Array[Array[Number, Number],...]} curve ����ÿ���ο���
     * @param {Number} rate ����
     * @return {Array[Array,Array]} ���ر��ü����������������
     */
    function cutBezier(curve, rate){
        if (!curve || curve.length < 2) return;
        var pa = curve[0], pb = curve[curve.length - 1],
            ta = [], tb = [],
            ra = [], rb = [];
        for (var i = 0; i < curve.length; i++){
            ta.push(curve[i]);
            ra.push(bezier(ta, rate));

            tb.unshift(curve[curve.length - i - 1]);
            rb.unshift(bezier(tb, rate));
        }
        return [ra, rb];
    }
    /*
     * ��תһ��������
     * @param {Array} point Ŀ������
     * @param {Array} center ���ĵ�
     * @param {Number} angle ѡ��Ƕȣ���λ:����
     * @return {Array} ������ת�������
     */
    function rotatePoint(point, center, angle){
        var radius = pointToPoint(center, point);
        angle = pointToAngle(center, point) + angle;
        return [
            center[0] + Math.cos(angle) * radius,
            center[1] + Math.sin(angle) * radius
        ];
    }

    /*
     * ��ȡ�����߶εĽ���
     * @param {Array[Number,Number]} a ��һ���߶�����1
     * @param {Array[Number,Number]} b ��һ���߶�����2
     * @param {Array[Number,Number]} c �ڶ����߶�����1
     * @param {Array[Number,Number]} d �ڶ����߶�����2
     * @return {Array[Number,Number]} ���������߶εĽ�������
     */
    function doubleLineIntersect(a, b, c, d){
        var delta = (b[1] - a[1]) * (d[0] - c[0]) -
            (d[1] - c[1]) * (b[0] - a[0]);
        if (delta == 0) return;
        var x = (                                                           
                (b[0] - a[0]) *
                (d[0] - c[0]) *
                (c[1] - a[1]) +
                
                (b[1] - a[1]) *
                (d[0] - c[0]) *
                a[0] -
                
                (d[1] - c[1]) *
                (b[0] - a[0]) * c[0]
            ) / delta,
            y = (
                (b[1] - a[1]) *
                (d[1] - c[1]) *
                (c[0] - a[0]) +
                
                (b[0] - a[0]) *
                (d[1] - c[1]) *
                a[1] -
                
                (d[0] - c[0]) *
                (b[1] - a[1]) *
                c[1]
            ) / -delta;
            
        if (
            (sign(x - a[0]) * sign(x - b[0]) <= 0) &&
            (sign(x - c[0]) * sign(x - d[0]) <= 0) &&
            (sign(y - a[1]) * sign(y - b[1]) <= 0) &&
            (sign(y - c[1]) * sign(y - d[1]) <= 0)
        ){
            return [x, y];
        }
    }

    exports.pointToPoint = pointToPoint;
    exports.pointToLine = pointToLine;
    exports.bezier = bezier;
    exports.cutBezier = cutBezier;
    exports.pointToAngle = pointToAngle;
    exports.doubleLineIntersect = doubleLineIntersect;
    exports.rotatePoint = rotatePoint;
}(AceGeometric);