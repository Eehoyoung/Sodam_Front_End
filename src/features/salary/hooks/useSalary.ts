import {useState, useEffect} from 'react';

// Define salary type
export type MonthlySalary = {
    amount: number;
    workingHours: number;
    deductions: number;
    // Add other salary properties as needed
};

export const useSalary = () => {
    const [monthlySalary, setMonthlySalary] = useState<MonthlySalary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                setIsLoading(true);
                // In a real app, this would be an API call
                // For now, we'll use mock data
                const mockSalary: MonthlySalary = {
                    amount: 1850000, // 1,850,000원
                    workingHours: 160,
                    deductions: 185000, // 10% 공제
                };

                // Simulate API delay
                setTimeout(() => {
                    setMonthlySalary(mockSalary);
                    setIsLoading(false);
                }, 500);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
                setIsLoading(false);
            }
        };

        fetchSalary();
    }, []);

    return {monthlySalary, isLoading, error};
};
