import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Feeds from "./Feeds";
import Guest from "./Guest";

const Index: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return user ? <Feeds /> : <Guest />;
};

export default Index;
