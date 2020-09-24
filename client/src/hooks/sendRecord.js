export const sendRecord = async (user) => {
        try {
            const response = await fetch('api/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Some went wrong!')
            }

            return data
        } catch (e) {
            throw e
        }
};