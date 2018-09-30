<script>
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    export default {
        token,
        user
    }
</script>