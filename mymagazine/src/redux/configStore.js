import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user"; // user.js의 리듀서 가지고옴
import Post from "./modules/post"; // post.js의 리듀서 가지고옴

// 히스토리 만들기
export const history = createBrowserHistory(); // history객체 생성

const rootReducer = combineReducers({ // 리듀서 만들때마다 여기 넣어주면 된다. 
    user: User,
    post: Post,
    router: connectRouter(history), // 우리가 위에서 만든 history랑 Router가 연결되었음
});

// 미들웨서 사용할 수 있게 생성 - 비동기 작업 처리할 수 있게해줌
const middlewares = [thunk.withExtraArgument({history:history})]; // 배열 안에 내가 사용할 미들웨어 다 넣으면 된다. 
// withExtraArgument : thunk 안에 내장된 함수
// 리듀서 실행되기 전 단계, 미들웨어 함수 사용할 때 history 사용할 수 있게된다. 
// 비동기 갔다와서 .then()해서 그 때 history 사용할 수 있게됨


// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
if (env === "development") {
    const { logger } = require("redux-logger");
    middlewares.push(logger);
}

// redux devTools 설정
const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
        : compose;

// 미들웨어 묶기
const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
);

// 스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
