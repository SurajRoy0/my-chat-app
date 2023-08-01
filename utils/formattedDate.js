import Moment from "react-moment";

export const formatDateConditionally = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
        return "now";
    }

    if (diff < 3600000) {
        return `${Math.round(diff / 60000)} min ago`;
    }

    if (diff < 86400000) {
        return <Moment format="h:mm A">{date}</Moment>;
    }

    return <Moment format="MM/DD/YY">{date}</Moment>;
};
