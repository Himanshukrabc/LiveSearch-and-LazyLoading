const KMP = (value,key)=>{
    value=value.toLowerCase();
    key=key.toLowerCase();
    var n=value.length;
    var m=key.length;
    var lps=[];
    var i=0,j=-1;
    lps[0]=-1;
    while(i<m){
        while(j!==-1&&value[i]!==value[j])j=lps[j];
        i++;j++;
        lps[i]=j;
    }
    i=0;j=0;
    while((n-i)>=(m-j)){
        if(key.charAt(j)===value.charAt(i)){
            j++;
            i++;
        }
        if(j===m){
            j=lps[j];
            return true;
        }
        else if(i<n&&key.charAt(j)!==value.charAt(i)) {
            if(j!==0)j=lps[j];
            else i=i+1;
        }
    }
    return false;
}

export default KMP;