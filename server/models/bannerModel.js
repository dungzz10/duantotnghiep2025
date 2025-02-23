import mongoose from 'mongoose';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Ho_Chi_Minh');

const BannerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        link: { type: String, default: '' },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.createdAt = moment(ret.createdAt).format('DD/MM/YYYY HH:mm:ss');
                ret.updatedAt = moment(ret.updatedAt).format('DD/MM/YYYY HH:mm:ss');
                delete ret.id;
            }
        }
    }
)

export default mongoose.model('Banner', BannerSchema);