import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        console.log(req.body)
        const {
            vnfid,
            userid,
            success,
            processormatched,
            memorymatched,
            storagematched,
            bandwidthmatched,
            securitymatched,
            throughput,
            latency,
            score,
            name
        } = req.body;

        // Basic validation
        if (
            vnfid === undefined ||
            userid === undefined ||
            success === undefined ||
            processormatched === undefined ||
            memorymatched === undefined ||
            storagematched === undefined ||
            bandwidthmatched === undefined ||
            securitymatched === undefined ||
            throughput === undefined ||
            latency === undefined ||
            score === undefined ||
            name === undefined
        ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const result = await query(
                `INSERT INTO isp_review 
                (vnfid, userid, success, processormatched, memorymatched, storagematched, bandwidthmatched, securitymatched, throughput, latency ,score, name) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12) 
                RETURNING id`,
                [vnfid, userid, success, processormatched, memorymatched, storagematched, bandwidthmatched, securitymatched, throughput, latency, score, name]
            );
            const newReview = result.rows[0];
            return res.status(201).json({ message: 'ISP Review created', review: newReview });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
