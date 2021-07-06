// user_id, user_pwd를 쿠키로 저장한다.
// 일단 함수 필요하고 3개 틀을 먼저 만들어 놓는다. 

// 쿠키를 만들기 함수   
// 이름 받아오기
// 키값 기준으로 쿠키에 저장된 값을 가져오는 함수
const getCookie = (name) => {
    // 쿠키 값을 가져옵니다.
    let value = "; " + document.cookie;
    // 키 값을 기준으로 파싱합니다.
    let parts = value.split("; " + name + "=");
    console.log(parts);
    // value를 return!
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
};

// 이름, 값, 만료일 받아오기 (만료일은 기본값 넣어주고 안받아와도됨)
// 쿠키에 저장하는 함수
const setCookie = (name, value, exp = 5) => {
    let date = new Date();
    // 날짜를 만들어줍니다.(만료일만큼의 날짜 만들었음)
    date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
    // 저장!
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

// 이름 받아와서 만료일 예전으로 설정해서 만료시켜서 쿠키를 지운다
// 만료일을 예전으로 설정해 쿠키를 지웁니다.
const deleteCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
}

export { getCookie, setCookie, deleteCookie };
