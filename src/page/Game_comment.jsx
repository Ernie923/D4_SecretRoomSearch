import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Game_comment() {
  // const [comments, setComment] = useState([]);
  const [gamesData, setGamesData] = useState([]);

  // const getComments = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/commentsData`);
  //     console.log(res.data);
  //     setComment(res.data);

  //     if (res.data.length > 0) {
  //       const gameIdFromComments = res.data[0].game_id;
  //       const gameRes = await axios.get(
  //         `${BASE_URL}/gamesData/${gameIdFromComments}`
  //       );
  //       console.log(gameRes.data);
  //       setGamesData(gameRes.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const game_id = 1;

  const getGamesData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/gamesData/${game_id}`);
      setGamesData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   getComments();
  // }, []);

  useEffect(() => {
    getGamesData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  // const onSubmit = handleSubmit((data) => {
  //   const { message, ...user } = data;

  //   const userInfo = {
  //     data: {
  //       user,
  //       message,
  //     },
  //   };
  //   checkout(userInfo);
  // });

  // const checkout = async () => {
  //   try {
  //     await axios.post(`${BASE_URL}/commentsData`);
  //     reset();
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  return (
    <>
      <Header></Header>
      <main>
        <div className="container-fluid container-lg">
          <div className="rol d-flex justify-content-center">
            <div className="col-xl-10">
              <Form className="pb-10" onSubmit={handleSubmit(onSubmit)}>
                <picture>
                  <source
                    media="(min-width: 992px)"
                    src={`${gamesData.game_img}`}
                  />
                  <img
                    src="../assets/images/julia-kadel-sm.png"
                    alt="banner"
                    className="w-100"
                  />
                </picture>
                <div>
                  <div className="py-10">
                    <h1 className="fs-lg-Display2 fs-h5 fw-bold">
                      遊戲名稱：{`${gamesData.game_name}`}
                    </h1>
                  </div>
                  <div className="mb-6">
                    <h2 className="fs-lg-h2 fs-h6 fw-bold">整體評價</h2>
                    <p className="py-3">
                      依據您遊玩的經驗，整體而言您會給這個遊戲幾分?
                    </p>
                    <div className="box">
                      <input
                        type="radio"
                        name="star"
                        id="score5"
                        value="5"
                        {...register("radio")}
                      />
                      <label className="star" htmlFor="score5"></label>
                      <input
                        type="radio"
                        name="star"
                        id="score4"
                        value="4"
                        {...register("radio")}
                      />
                      <label className="star" htmlFor="score4"></label>
                      <input
                        type="radio"
                        name="star"
                        id="score3"
                        value="3"
                        {...register("radio")}
                      />
                      <label className="star" htmlFor="score3"></label>
                      <input
                        type="radio"
                        name="star"
                        id="score2"
                        value="2"
                        {...register("radio")}
                      />
                      <label className="star" htmlFor="score2"></label>
                      <input
                        type="radio"
                        name="star"
                        id="score1"
                        value="1"
                        {...register("radio")}
                      />
                      <label className="star" htmlFor="score1"></label>
                    </div>
                  </div>
                  <div>
                    <form>
                      <div className="row mb-6">
                        <h2 className="fs-lg-h2 fs-h6 fw-bold">難度與特色</h2>
                        <div className="row py-3">
                          <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">難度</h3>
                          <div className="col-auto">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio1"
                              value="option1"
                              {...register("radio")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="inlineRadio1"
                            >
                              新手入門
                            </label>
                          </div>
                          <div className="col-auto">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio2"
                              value="option2"
                              {...register("radio")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="inlineRadio2"
                            >
                              中度玩家
                            </label>
                          </div>
                          <div className="col-auto">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="inlineRadioOptions"
                              id="inlineRadio3"
                              value="option3"
                              {...register("radio")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="inlineRadio3"
                            >
                              重度解謎
                            </label>
                          </div>
                        </div>
                        <div className="row py-3" id="input_3_2">
                          <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                            主題特色(最多選3項)
                          </h3>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck1"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck1"
                              >
                                偵探推理
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck2"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck2"
                              >
                                機關重重
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck3"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck3"
                              >
                                劇情厲害
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck4"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck4"
                              >
                                場景逼真
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck5"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck5"
                              >
                                互動操作
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck6"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck6"
                              >
                                謎題邏輯
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck7"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck7"
                              >
                                輕鬆歡樂
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck8"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck8"
                              >
                                恐怖驚悚
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck9"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck9"
                              >
                                緊張刺激
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck10"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck10"
                              >
                                勾心鬥角
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck11"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck11"
                              >
                                團隊合作
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck12"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck12"
                              >
                                親子同遊
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck13"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck13"
                              >
                                玩法特殊
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck14"
                                {...register("checkbox")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="autoSizingCheck14"
                              >
                                角色扮演
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-6">
                        <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                          遊玩日期
                        </h3>
                        <div className="col-12">
                          <input
                            type="date"
                            className={`form-control ${
                              errors.date && "is-invalid"
                            }`}
                            {...register("date", {
                              required: "日期欄位必填",
                              pattern: {
                                value:
                                  /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
                                message: "日期格式錯誤",
                              },
                            })}
                          />
                        </div>
                      </div>
                      <div className="row mb-6">
                        <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                          遊戲完成度
                        </h3>
                        <div className="col-auto">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadioSuccess"
                            value="option1"
                            {...register("radio")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadioSuccess"
                          >
                            過關
                          </label>
                        </div>
                        <div className="col-auto">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="inlineRadioOptions"
                            id="inlineRadioFail"
                            value="option2"
                            {...register("radio")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineRadioFail"
                          >
                            未通關
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <h3 className="fs-lg-h3 fs-h6 fw-bold pb-2">
                          體驗心得
                        </h3>
                        <div className="col-12">
                          <textarea
                            className={`form-control ${
                              errors.message && "is-invalid"
                            }`}
                            id="experience"
                            rows="5"
                            {...register("thoughts")}
                          ></textarea>
                          <label
                            htmlFor="experience"
                            className="form-label"
                          ></label>
                        </div>
                      </div>
                      <div className="col-12 d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-secondary-60 link-white rounded-1"
                        >
                          送出
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}
export default Game_comment;
