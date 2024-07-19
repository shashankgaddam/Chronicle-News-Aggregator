import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//import Spinner from "react-bootstrap/Spinner";
import { baseURL, categories as categoriesList } from "../utilities/constants";
import "../css/Headlines.css";
import Filters from "./Filters";
import FollowedArticles from "./FollowedArticles";
import Categories from "./Categories";
import { hasFollowedNews } from "../utilities/helper";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

const Index = () => {
    // write task 3 state here(useState)
    const [date, setDate] = useState();
    const [country, setCountry] = useState("us");
    const [categories, setCategories] = useState([]);
    const [news, setNews] = useState([]);

    const apiKey = process.env.REACT_APP_NEWS_KEY;

    function onDateChange(newDate) {
        setDate(newDate)
    }

    function onCountryChange(newCountry) {
        console.log('The new country: ', newCountry);
        setCountry(newCountry)
    }

    function onCategoryChange(newCategories) {
        setCategories(newCategories)
    }

    // write task 4 solution here

    useEffect(() => {
        let urls = [];
        let toParam = "";
        let fromParam = "";
        console.log('The country value is: ', country);
        let paramCountry = country?.value ? `&country=${country.value}` : "&country=us";
        if (Array.isArray(date)) {
            let apiUrl = `${baseURL}/top-headlines/sources?apiKey=${apiKey}&pageSize=10`;
            toParam = date[0].toISOString().split('T')[0];
            fromParam = date[1].toISOString().split('T')[0];
            apiUrl += apiUrl + `&to=${toParam}&from=${fromParam}`;
            if (categories.length > 0) {
                let url;
                for (let i = 0; i < categories.length; i++) {
                    url = apiUrl + paramCountry +`&category=${categories[i].value.toLowerCase()}`;
                    console.log('url in the date if block: ', url)
                    urls.push(url);
                }
            } else {
                let url = apiUrl + paramCountry;
                console.log('url in the date else block: ', url)
                urls.push(url);
            }
        } else {
            let apiUrl = `${baseURL}/top-headlines?apiKey=${apiKey}&pageSize=10`;
            if (categories.length > 0) {
                let url;
                for (let i = 0; i < categories.length; i++) {
                    url = apiUrl + paramCountry +`&category=${categories[i].value.toLowerCase()}`;
                    console.log('url in the not date if block: ', url)
                    urls.push(url);
                }
            } else {
                let url = apiUrl + paramCountry;
                console.log('apiUrl value in the not date else block: ', apiUrl);
                console.log('The paramCountry value: ', paramCountry)
                console.log('url in the not date else block: ', url);
                urls.push(url);
            }
        }

        console.log('The urls value: ', urls);

        function fetchNews() {
            let categoryNews = [];
            urls.forEach(async (url) => {
                let response = await fetch(url)
                if (!response.ok) {
                    throw new Error("Error fetching the news")
                }
                const data = await response.json();

                const { sources, articles } = data
                let newsObj = {};
                let category;
                const searchParams = new URLSearchParams(url);
                let categoryParam = searchParams.get("category");
                if (sources) {
                    let apiUrl = `${baseURL}/everything&apiKey=${apiKey}&pageSize=10`;
                    const sourcesParam = sources.slice(0, 20).map(item => `${item.id}`).join(",");
                    let newsUrl = apiUrl + `&sources=${sourcesParam}&to=${toParam}&from=${fromParam}`
                    let response = await fetch(newsUrl)
                    if (!response.ok) {
                        throw new Error("Error while fetching the source realted news");
                    }
                    let newsData = await response.json();
                    newsObj.articles = newsData.articles
                    if (categoryParam) {
                        category = categoriesList.find((item) => item.value.toLowerCase() === categoryParam.toLowerCase());
                    } else {
                        category = {
                            label: "Headlines",
                            value: "breaking-news",
                            icon: faNewspaper,
                        };

                    }
                    newsObj.category = category
                }
                if (articles) {
                    if (categoryParam) {
                        category = categoriesList.find((item) => item.value.toLowerCase() === categoryParam.toLowerCase());
                    } else {
                        category = {
                            label: "Headlines",
                            value: "breaking-news",
                            icon: faNewspaper,
                        };

                    }
                    newsObj.category = category
                    newsObj.articles = articles
                }
                categoryNews = [...categoryNews, newsObj];
            setNews(categoryNews);
            });
        }
        fetchNews();
        // eslint-disable-next-line
    }, [date, country, categories])

    // Write task 11 Create state solution

    return (
        <Container className="main_container my-5">
            <Row className="col-xxl-10 mx-auto">
                <h1>Chronicle News</h1>
                {
                    /* write task 3 here */
                    <Filters changeDate={onDateChange}
                        changeCountry={onCountryChange}
                        changeCategory={onCategoryChange} />
                }

                {
                    /* write task 6 here */
                    news && news.map((item, index)=> {
                        return (
                            <Categories key = {index} news={item}/>
                        )
                    })
                }

                {
                    hasFollowedNews() && <FollowedArticles /> 
                }

            </Row>
        </Container>
    );
};

export default Index;