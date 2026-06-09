import DetailedViewCard from "../components/detailed-view/detailedViewCard";

export default function CandidateDetailedView() {
    const candidateId = "6a2157d3162295c228bcb6c7"; // Replace with actual candidate ID
    return (
        <>
            <DetailedViewCard
                module="candidates"
                // id="6a2157d3162295c228bcb6c7"
                id={"6a2157d3162295c228bcb6c7"}
            />
        </>
    )
}